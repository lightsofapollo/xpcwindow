/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var MozTCPSocket = TCPSocket;
var EXPORTED_SYMBOLS = ['MozTCPSocket'];


const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;
const Cr = Components.results;
const CC = Components.Constructor;

Cu.import('resource://xpcwindow/lib/components/event-emitter.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://gre/modules/Services.jsm');

let debug = false;
function LOG(msg) {
  if (debug)
    dump(msg);
}

/*
 * nsITCPSocketEvent object
 */
function TCPSocketEvent(sock, type, data) {
  this.socket = sock;
  this.type = type;
  this.data = data;
}

/*
 * nsITCPSocket object
 */
function createTransport(host, port, sslMode) {
  let options, optlen;
  if (sslMode) {
    options = [sslMode];
    optlen = 1;
  } else {
    options = null;
    optlen = 0;
  }
  return Cc['@mozilla.org/network/socket-transport-service;1']
           .getService(Ci.nsISocketTransportService)
           .createTransport(options, optlen, host, port, null);
}

const MAX_SEND_BUFFER_SIZE_64K_CHUNKS = 128 * 16;

const InputStreamPump = CC(
        '@mozilla.org/network/input-stream-pump;1', 'nsIInputStreamPump', 'init'),
      Pipe = CC('@mozilla.org/pipe;1', 'nsIPipe', 'init'),
      AsyncStreamCopier = CC(
        '@mozilla.org/network/async-stream-copier;1', 'nsIAsyncStreamCopier', 'init'),
      ScriptableInputStream = CC(
        '@mozilla.org/scriptableinputstream;1', 'nsIScriptableInputStream'),
      BinaryInputStream = CC(
        '@mozilla.org/binaryinputstream;1', 'nsIBinaryInputStream'),
      BinaryOutputStream = CC(
        '@mozilla.org/binaryoutputstream;1', 'nsIBinaryOutputStream', 'setOutputStream');

const CONNECTING = 'connecting';
const OPEN = 'open';
const CLOSING = 'closing';
const CLOSED = 'closed';

function TCPSocket() {
  this.readyState = CLOSED;

  this.onopen = null;
  this.ondrain = null;
  this.ondata = null;
  this.onerror = null;
  this.onclose = null;

  this.binaryType = 'string';

  this.host = '';
  this.port = -1;
  this.ssl = false;

  EventEmitter.call(this);

  this.open.apply(this, arguments);
};

TCPSocket.prototype = {

  __proto__: EventEmitter.prototype,

  CONNECTING: CONNECTING,
  OPEN: OPEN,
  CLOSING: CLOSING,
  CLOSED: CLOSED,
  _binaryType: null,
  _outputStreamPipe: null,
  _inputStream: null,
  _scriptableInputStream: null,
  _transport: null,
  _rawOutputStream: null,
  _request: null,
  _waitingOnOutput: false,
  _hasPrivileges: null,

  get bufferedAmount() {
    return this._outputStreamPipe.inputStream.available();
  },

  // nsITCPSocket
  open: function ts_open(host, port, options) {
    // in the testing case, init won't be called and
    // hasPrivileges will be null. We want to proceed to test.
    if (this._hasPrivileges === false) {
      LOG('TCPSocket does not have permission in this context.\n');
      return;
    }

    LOG('startup called\n');
    LOG('Host info: ' + host + ':' + port + '\n');

    this.readyState = CONNECTING;
    this.host = host;
    this.port = port;
    if (options != null) {
      switch (options.useSSL) {
        case true:
          this.ssl = 'ssl';
          break;
        case 'starttls':
          this.ssl = 'starttls';
          break;
        default:
          this.ssl = false;
      }
      this.verifyCert = options.verifyCert === true;
      this._binaryType = options.binaryType || this._binaryType;
    } else {
      this.ssl = false;
      this.verifyCert = false;
    }
    LOG('SSL: ' + this.ssl + '\n');

    let transport = this._transport = createTransport(host, port, this.ssl);
    // call onTransportStatus when connected
    transport.setEventSink(this, Services.tm.currentThread);


    this._inputStream = transport.openInputStream(0, 0, 0);
    this._scriptableInputStream = new ScriptableInputStream();
    this._binaryInputStream = new BinaryInputStream();

    this._rawOutputStream = transport.openOutputStream(
      Ci.nsITransport.OPEN_UNBUFFERED, 0, 0);

    this._outputStreamPipe = Pipe(
      true, true, 65536, MAX_SEND_BUFFER_SIZE_64K_CHUNKS, null);

    this._outputStreamCopier = AsyncStreamCopier(
      this._outputStreamPipe.inputStream,
      this._rawOutputStream,
      // (nsSocketTransport uses gSocketTransportService)
      Cc['@mozilla.org/network/socket-transport-service;1']
        .getService(Ci.nsIEventTarget),
      /* source buffered */ true, /* sink buffered */ false,
      65536, /* close source*/ true, /* close sink */ true);

    // Since we drive the output stream, we don't need to listen to it.
    this._outputStreamCopier.asyncCopy(null, null);
    this._binaryOutputStream = new BinaryOutputStream(
      this._outputStreamPipe.outputStream);

    // If the other side closes the connection, we will
    // get an onInputStreamReady callback with zero length
    // available to indicate the connection was closed.
    this._inputStream.asyncWait(
      this, this._inputStream.WAIT_CLOSURE_ONLY, 0, Services.tm.currentThread);
  },

  close: function ts_close() {
    if (this.readyState === CLOSING || this.readyState === CLOSED)
      return;

    LOG('shutdown called\n');
    this.readyState = CLOSING;

    this._rawOutputStream.close();
    this._inputStream.close();
    this._transport.close(Cr.NS_OK);
  },

  startTLS: function() {
    this._transport.securityInfo.QueryInterface(
      Ci.nsISSLSocketControl
    ).StartTLS();
  },

  send: function ts_send(data) {
    if (data === undefined)
      return;

    if (this._binaryType === 'arraybuffer') {
      this._binaryOutputStream.writeByteArray(data, data.length);
    } else {
      this._binaryOutputStream.writeBytes(data, data.length);
    }


    if (this.bufferedAmount> 65535) {
      if (!this._waitingOnOutput) {
        this._waitingOnOutput = true;
        this._outputStreamPipe.outputStream.asyncWait(
          this, 0, 0, Services.tm.currentThread);
      }
      return true;
    }
    return false;
  },

  suspend: function ts_suspend() {
    if (this._request) {
      this._request.suspend();
    }
  },

  resume: function ts_resume() {
    if (this._request) {
      this._request.resume();
    }
  },

  onTransportStatus: function ts_onTransportStatus(
    transport, status, progress, max) {

    if (status === Ci.nsISocketTransport.STATUS_CONNECTED_TO) {
      this.readyState = OPEN;
      this.dispatchEvent('open');

      new InputStreamPump(
        this._inputStream, -1, -1, 0, 0, false
      ).asyncRead(this, null);
    }
  },
  // nsIAsyncInputStream
  onInputStreamReady: function ts_onInputStreamReady(input) {
    var len = 0;
    try {
      len = input.available();
    } catch (e) {
      // Connection refused
    }
    if (!len) {
      LOG('Connection refused\n');
      this.dispatchEvent('error', 'Connection refused');
    }
  },
  // nsIAsyncOutputStream
  onOutputStreamReady: function ts_onOutputStreamReady(stream, blah) {
    this._waitingOnOutput = false;
    this.dispatchEvent('drain');
  },

  // nsIRequestObserver
  onStartRequest: function ts_onStartRequest(request, context) {
    this._request = request;
  },

  onStopRequest: function ts_onStopRequest(request, context, status) {
    dump('\nSTOP' + JSON.stringify(status) + '\n');
    this.readyState = CLOSED;
    this._request = null;

    if (status) {
      var key;

      for (key in Ci.nsISocketTransport) {
        if(status === Ci.nsISocketTransport[key]) {
          dump(key + '\n');
        }
      }

      this.dispatchEvent('error', 'Error ' + status);
    }

    this.dispatchEvent('close');
  },

  onDataAvailable: function ts_onDataAvailable(request, context, inputStream, offset, count) {
    if (this._binaryType === 'arraybuffer') {
      let ua = new Uint8Array(count);

      this._binaryInputStream.setInputStream(inputStream);
      ua.set(this._binaryInputStream.readByteArray(count));
      this.dispatchEvent('data', ua);
    } else {
      this._scriptableInputStream.init(inputStream);
      this.dispatchEvent('data', this._scriptableInputStream.read(count));
    }
  }

}
