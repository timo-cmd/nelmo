
var elmie = require('..');

exports['evaluate integers'] = function (test) {
	test.strictEqual(elmie.evaluate('42'), 42);
	test.strictEqual(elmie.evaluate('0'), 0);
}

exports['evaluate strings'] = function (test) {
	test.strictEqual(elmie.evaluate('"foo"'), 'foo');
	test.strictEqual(elmie.evaluate('"bar"'), 'bar');
	test.strictEqual(elmie.evaluate('""'), '');
}

exports['evaluate booleans'] = function (test) {
	test.strictEqual(elmie.evaluate('False'), false);
	test.strictEqual(elmie.evaluate('True'), true);
}
