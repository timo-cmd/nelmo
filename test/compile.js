
var elmie = require('..');

exports['compile integer'] = function (test) {
	var result = elmie.compile('42');
	
	test.ok(result);
	test.equal(result, '42;\n');
}

exports['compile string'] = function (test) {
	var result = elmie.compile('"foo"');
	
	test.ok(result);
	test.equal(result, '"foo";\n');
}

exports['compile dot expression'] = function (test) {
	var result = elmie.compile('foo.bar');
	
	test.ok(result);
	test.equal(result, 'foo.bar;\n');
}

exports['compile define expression'] = function (test) {
	var result = elmie.compile('answer = 42');
	
	test.ok(result);
	test.equal(result, 'var answer = 42;\n');
}

exports['compile type annotation'] = function (test) {
	var result = elmie.compile('answer : Int');
	
	test.strictEqual(result, '');
}

exports['compile type annotation and define expression'] = function (test) {
	var result = elmie.compile('answer : Int\nanswer = 42');
	
	test.ok(result);
	test.equal(result, 'var answer = 42;\n');
}

exports['compile native expression'] = function (test) {
	var result = elmie.compile('log = Native.console.log');
	
	test.ok(result);
	test.equal(result, 'var log = console.log;\n');
}

exports['compile native expression'] = function (test) {
	var result = elmie.compile('log = Native.console.log');
	
	test.ok(result);
	test.equal(result, 'var log = console.log;\n');
}

exports['compile text ignoring new lines'] = function (test) {
	var result = elmie.compile('\nlog = Native.console.log\n\n');
	
	test.ok(result);
	test.equal(result, 'var log = console.log;\n');
}

exports['compile add integers'] = function (test) {
	var result = elmie.compile('1 + 41');
	
	test.ok(result);
	test.equal(result, '1 + 41;\n');
}

exports['compile multiply integers'] = function (test) {
	var result = elmie.compile('2 * 21');
	
	test.ok(result);
	test.equal(result, '2 * 21;\n');
}

exports['compile divide integers'] = function (test) {
	var result = elmie.compile('84 / 2');
	
	test.ok(result);
	test.equal(result, '84 / 2;\n');
}

exports['compile integer divide integers'] = function (test) {
	var result = elmie.compile('84 // 2');
	
	test.ok(result);
	test.equal(result, '84 // 2;\n');
}

exports['compile add three integers'] = function (test) {
	var result = elmie.compile('1 + 1 + 42');
	
	test.ok(result);
	test.equal(result, '(1 + 1) + 42;\n');
}

exports['compile arithmetic operation with three integers using precedence'] = function (test) {
	var result = elmie.compile('1 + 2 * 3');
	
	test.ok(result);
	test.equal(result, '1 + (2 * 3);\n');
}

exports['compile arithmetic operation with three integers parenthesis'] = function (test) {
	var result = elmie.compile('(1 + 2) * 3');
	
	test.ok(result);
	test.equal(result, '(1 + 2) * 3;\n');
}

exports['compile dot with integer accessor'] = function (test) {
	var result = elmie.compile('numbers.42');
	
	test.ok(result);
	test.equal(result, 'numbers[42];\n');
}

exports['compile dot with string accessor'] = function (test) {
	var result = elmie.compile('numbers."foo"');
	
	test.ok(result);
	test.equal(result, 'numbers["foo"];\n');
}

exports['compile dot with expression accessor'] = function (test) {
	var result = elmie.compile('numbers.(41 + 1)');
	
	test.ok(result);
	test.equal(result, 'numbers[41 + 1];\n');
}

exports['compile function apply'] = function (test) {
	var result = elmie.compile('incr 1');
	
	test.ok(result);
	test.equal(result, 'incr(1);\n');
}

exports['compile function apply with type annotation'] = function (test) {
	var result = elmie.compile('incr : Int -> Int\nincr 1');
	
	test.ok(result);
	test.equal(result, 'incr(1);\n');
}

exports['compile function apply with type annotation with precedence over binary operator'] = function (test) {
	var result = elmie.compile('incr : Int -> Int\nincr 1 * 3');
	
	test.ok(result);
	test.equal(result, 'incr(1) * 3;\n');
}
