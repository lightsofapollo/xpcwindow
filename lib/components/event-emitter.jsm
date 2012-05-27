'use strict';


var EXPORTED_SYMBOLS = ['EventEmitter'];

/**
 * Constructor
 *
 * @param {Object} events of events to add onto responder.
 */
function EventEmitter(events) {
  this._$events = {};

  if (typeof(events) !== 'undefined') {
    this.addEventListener(events);
  }
};

EventEmitter.prototype = {
  parse: EventEmitter.parse,
  stringify: EventEmitter.stringify,

  /**
   * Events on this instance
   *
   * @type Object
   */
  _$events: null,

  /**
   * Adds an event listener to this object.
   *
   *
   * @param {String} type event name.
   * @param {Function} callback event callback.
   */
  addEventListener: function addEventListener(type, callback) {
    var event;

    if (typeof(callback) === 'undefined' && typeof(type) === 'object') {
      for (event in type) {
        if (type.hasOwnProperty(event)) {
          this.addEventListener(event, type[event]);
        }
      }

      return this;
    }

    if (!(type in this._$events)) {
      this._$events[type] = [];
    }

    this._$events[type].push(callback);

    return this;
  },

  /**
   * Adds an event listener which will
   * only fire once and then remove itself.
   *
   *
   * @param {String} type event name.
   * @param {Function} callback fired when event is emitted.
   */
  once: function once(type, callback) {
    var self = this;
    function onceCb() {
      self.removeEventListener(type, onceCb);
      callback.apply(this, arguments);
    }

    this.addEventListener(type, onceCb);

    return this;
  },

  /**
   * Emits an event.
   *
   * Accepts any number of additional arguments to pass unto
   * event listener.
   *
   * @param {String} eventName name of the event to emit.
   * @param {Object} [arguments] additional arguments to pass.
   */
  emit: function emit() {
    var args = Array.prototype.slice.call(arguments),
        event = args.shift(),
        eventList,
        self = this;

    if (event in this._$events) {
      eventList = this._$events[event];

      eventList.forEach(function(callback) {
        callback.apply(self, args);
      });
    }

    return this;
  },

  /**
   * Removes all event listeners for a given event type
   *
   *
   * @param {String} event event type to remove.
   */
  removeAllEventListeners: function removeAllEventListeners(name) {
    if (name in this._$events) {
      //reuse array
      this._$events[name].length = 0;
    }

    return this;
  },

  /**
   * Removes a single event listener from a given event type
   * and callback function.
   *
   *
   * @param {String} eventName event name.
   * @param {Function} callback same instance of event handler.
   */
  removeEventListener: function removeEventListener(name, callback) {
    var i, length, events;

    if (!(name in this._$events)) {
      return false;
    }

    events = this._$events[name];

    for (i = 0, length = events.length; i < length; i++) {
      if (events[i] && events[i] === callback) {
        events.splice(i, 1);
        return true;
      }
    }

    return false;
  }

};

EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;
EventEmitter.prototype.dispatchEvent = EventEmitter.prototype.emit;
