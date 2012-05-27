package:
	rm -f test/vendor/mocha.js
	rm -f test/vendor/expect.js
	cp node_modules/mocha/mocha.js test/vendor/mocha.js
	cp node_modules/expect.js/expect.js test/vendor/expect.js

.PHONY: test
test:
	# test paths are relative
	# to test/ not to /
	./bin/xpcwindow test/index.js \
		tcp-socket-test.js \
		timer-test.js \
		xhr-test.js
