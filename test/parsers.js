
var parsers = require('../lib/parsers');
var types = require('../lib/types');
var contexts = require('../lib/contexts');

function expr(text) {
	var parser = parsers.parser(text);
	
	var expr = parser.parseExpression();
	
	if (expr)
		return expr.compile();
	
	return null;
}

exports['parse empty string'] = function (test) {
	test.equal(expr(''), null);
}

exports['parse integer'] = function (test) {
	test.equal(expr('42'), '42');
}

exports['parse integer in parentheses'] = function (test) {
	test.equal(expr('(42)'), '42');
}

exports['parse float'] = function (test) {
	test.equal(expr('3.14159'), '3.14159');
}

exports['parse string'] = function (test) {
	test.equal(expr('"foo"'), '"foo"');
}

exports['parse boolean constants'] = function (test) {
	test.equal(expr('True'), 'true');
	test.equal(expr('False'), 'false');
}

exports['parse two integers'] = function (test) {
	var parser = parsers.parser('42\n3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '3');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse apply add'] = function (test) {
	var ctx = contexts.context();
	ctx.value('add', types.func(types.Int, types.func(types.Int, types.Int)));
	var parser = parsers.parser('add 1 2', ctx);
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'add(1, 2)');
	
	test.equal(parser.parseExpression(), null);
}

exports['invalid value applying add'] = function (test) {
	var ctx = contexts.context();
	ctx.value('add', types.func(types.Int, types.func(types.Int, types.Int)));
	var parser = parsers.parser('add 1 "foo"', ctx);
	
	try {
		parser.parseExpression();
	}
	catch (ex) {
		test.equal(ex.toString(), 'Error: Invalid value');
		return;
	}

	test.fail();
}

exports['parse apply add using indent'] = function (test) {
	var ctx = contexts.context();
	ctx.value('add', types.func(types.Int, types.func(types.Int, types.Int)));
	var parser = parsers.parser('add 1\n 2', ctx);
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'add(1, 2)');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse dot expression'] = function (test) {
	var parser = parsers.parser('foo.bar');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'foo.bar');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse add numbers'] = function (test) {
	var parser = parsers.parser('41 + 1');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '41 + 1');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse add three numbers'] = function (test) {
	var parser = parsers.parser('1 + 2 + 3');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '(1 + 2) + 3');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse subtract numbers'] = function (test) {
	var parser = parsers.parser('43 - 1');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '43 - 1');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse multiply numbers'] = function (test) {
	var parser = parsers.parser('21 * 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '21 * 2');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse divide numbers'] = function (test) {
	var parser = parsers.parser('84 / 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '84 / 2');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse mod numbers'] = function (test) {
	var parser = parsers.parser('83 % 5');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '83 % 5');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse exponentiation with numbers'] = function (test) {
	var parser = parsers.parser('3 ^ 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'Math.pow(3, 2)');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse equal numbers'] = function (test) {
	var parser = parsers.parser('3 == 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '3 === 2');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse equal strings'] = function (test) {
	var parser = parsers.parser('"foo" == "bar"');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '"foo" === "bar"');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse not equal numbers'] = function (test) {
	var parser = parsers.parser('3 /= 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '3 !== 2');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse not equal strings'] = function (test) {
	var parser = parsers.parser('"foo" /= "bar"');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '"foo" !== "bar"');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse less numbers'] = function (test) {
	var parser = parsers.parser('3 < 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '3 < 2');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse less strings'] = function (test) {
	var parser = parsers.parser('"foo" < "bar"');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '"foo" < "bar"');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse less equal numbers'] = function (test) {
	var parser = parsers.parser('3 <= 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '3 <= 2');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse less equal strings'] = function (test) {
	var parser = parsers.parser('"foo" <= "bar"');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '"foo" <= "bar"');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse greater numbers'] = function (test) {
	var parser = parsers.parser('3 > 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '3 > 2');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse greater strings'] = function (test) {
	var parser = parsers.parser('"foo" > "bar"');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '"foo" > "bar"');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse greater or equal numbers'] = function (test) {
	var parser = parsers.parser('3 >= 2');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '3 >= 2');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse greater or equal strings'] = function (test) {
	var parser = parsers.parser('"foo" >= "bar"');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), '"foo" >= "bar"');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse or booleans'] = function (test) {
	var parser = parsers.parser('False || True');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'false || true');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse and booleans'] = function (test) {
	var parser = parsers.parser('False && True');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'false && true');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse define expression'] = function (test) {
	var parser = parsers.parser('answer = 42');
	
	var expr = parser.parseExpression();
	
	test.ok(expr);
	test.equal(expr.compile(), 'var answer = 42');
	
	test.equal(parser.parseExpression(), null);
}

exports['parse simple type using Int'] = function (test) {
	var ctx = contexts.context();
	var parser = parsers.parser('type Id = Int', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.type('Id'));
	test.strictEqual(ctx.type('Id'), types.Int);
}

exports['parse simple type using functional type'] = function (test) {
	var ctx = contexts.context();
	var parser = parsers.parser('type Decoder = Int -> String', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.type('Decoder'));
	test.ok(ctx.type('Decoder').equals(types.func(types.Int, types.String)));
}

exports['parse type annotation'] = function (test) {
	var ctx = contexts.context();
	var parser = parsers.parser('answer : Int', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.value('answer'));
	test.ok(ctx.value('answer').equals(types.Int));
}

exports['parse type annotation and define'] = function (test) {
	var ctx = contexts.context();
	var parser = parsers.parser('answer : Int\nanswer = 42', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.value('answer'));
	test.ok(ctx.value('answer').equals(types.Int));
	
	var result = parser.parseExpression();
	
	test.ok(result);
	test.equal(result.compile(), 'var answer = 42');
}

exports['check type annotation'] = function (test) {
	var ctx = contexts.context();
	var parser = parsers.parser('answer : Int\nanswer = "foo"', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.value('answer'));
	test.ok(ctx.value('answer').equals(types.Int));
	
	try {
		parser.parseExpression();
	}
	catch (ex) {
		test.equal(ex.toString(), 'Error: Invalid value');
		return;
	}

	test.fail();
}

exports['parse anonymous function with one argument'] = function (test) {
	var parser = parsers.parser('\\n -> add n 1');
	
	var result = parser.parseExpression();
	
	test.ok(result);
	test.equal(result.compile(), '(function (n) { return add(n, 1); })');
}

exports['parse anonymous function with one argument and binary add'] = function (test) {
	var ctx = contexts.context();
	ctx.value('n', types.Int);
	var parser = parsers.parser('\\n -> n + 1', ctx);
	
	var result = parser.parseExpression();
	
	test.ok(result);
	test.equal(result.compile(), '(function (n) { return n + 1; })');
}

exports['parse type annotation and define'] = function (test) {
	var ctx = contexts.context();
	var parser = parsers.parser('incr: Int -> Int\nincr n = add n 1', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.value('incr'));
	test.ok(ctx.value('incr').equals(types.func(types.Int, types.Int)));
	
	var result = parser.parseExpression();
	
	test.ok(result);
	test.equal(result.compile(), 'function incr(n) { return add(n, 1); }');
}

exports['parse type annotation and define using binary add'] = function (test) {
	var ctx = contexts.context();
	var parser = parsers.parser('incr: Int -> Int\nincr n = n + 1', ctx);
	
	test.strictEqual(parser.parseExpression(), false);
	
	test.ok(ctx.value('incr'));
	test.ok(ctx.value('incr').equals(types.func(types.Int, types.Int)));
	
	var result = parser.parseExpression();
	
	test.ok(result);
	test.equal(result.compile(), 'function incr(n) { return n + 1; }');
}



