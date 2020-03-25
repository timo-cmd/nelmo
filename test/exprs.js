
var exprs = require('../lib/exprs.js');
var types = require('../lib/types.js');

exports['integer constant expression'] = function (test) {
	var cons = exprs.constant(42, types.Int);
	
	test.ok(cons);
	test.equal(typeof cons, 'object');
	test.strictEqual(cons.evaluate(), 42);
	test.strictEqual(cons.type(), types.Int);
	test.strictEqual(cons.compile(), '42');
}

exports['float constant expression'] = function (test) {
	var cons = exprs.constant(3.14159, types.Float);
	
	test.ok(cons);
	test.equal(typeof cons, 'object');
	test.strictEqual(cons.evaluate(), 3.14159);
	test.strictEqual(cons.type(), types.Float);
	test.strictEqual(cons.compile(), '3.14159');
}

exports['string constant expression'] = function (test) {
	var cons = exprs.constant('foo', types.String);
	
	test.ok(cons);
	test.equal(typeof cons, 'object');
	test.strictEqual(cons.evaluate(), 'foo');
	test.strictEqual(cons.type(), types.String);
	test.strictEqual(cons.compile(), '"foo"');
}

exports['add integer integer expression'] = function (test) {
	var add = exprs.add(exprs.constant(41, types.Int), exprs.constant(1, types.Int));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '41 + 1');
}

exports['add integer float expression'] = function (test) {
	var add = exprs.add(exprs.constant(41, types.Int), exprs.constant(1.5, types.Float));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42.5);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '41 + 1.5');
}

exports['add float integer expression'] = function (test) {
	var add = exprs.add(exprs.constant(41.5, types.Float), exprs.constant(1, types.Int));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42.5);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '41.5 + 1');
}

exports['add expression with left number'] = function (test) {
	var add = exprs.add(exprs.constant(40.5, types.Number), exprs.constant(1.5, types.Float));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '40.5 + 1.5');
}

exports['add expression with right number'] = function (test) {
	var add = exprs.add(exprs.constant(40.5, types.Float), exprs.constant(1.5, types.Number));
	
	test.ok(add);
	test.equal(typeof add, 'object');
	test.strictEqual(add.evaluate(), 42);
	test.strictEqual(add.type(), types.Number);
	test.strictEqual(add.compile(), '40.5 + 1.5');
}

exports['invalid add expression with left string'] = function (test) {
	try {
		exprs.add(exprs.constant("foo", types.String), exprs.constant(1.5, types.Number));
		test.fail();
	}
	catch (ex) {
		
	}
}

exports['invalid add expression with right string'] = function (test) {
	try {
		exprs.add(exprs.constant(42, types.Int), exprs.constant("foo", types.String));
		test.fail();
	}
	catch (ex) {
		
	}
}

exports['subtract integer integer expression'] = function (test) {
	var subtract = exprs.subtract(exprs.constant(43, types.Int), exprs.constant(1, types.Int));
	
	test.ok(subtract);
	test.equal(typeof subtract, 'object');
	test.strictEqual(subtract.evaluate(), 42);
	test.strictEqual(subtract.type(), types.Number);
	test.strictEqual(subtract.compile(), '43 - 1');
}

exports['subtract integer integer expression using name'] = function (test) {
	var subtract = exprs.subtract(exprs.constant(43, types.Int), exprs.name('one', types.Int));
	
	test.ok(subtract);
	test.equal(typeof subtract, 'object');
	test.strictEqual(subtract.evaluate({ names: { one: 1 } }), 42);
	test.strictEqual(subtract.type(), types.Number);
	test.strictEqual(subtract.compile(), '43 - one');
}

exports['multiply integer integer expression'] = function (test) {
	var multiply = exprs.multiply(exprs.constant(21, types.Int), exprs.constant(2, types.Int));
	
	test.ok(multiply);
	test.equal(typeof multiply, 'object');
	test.strictEqual(multiply.evaluate(), 42);
	test.strictEqual(multiply.type(), types.Number);
	test.strictEqual(multiply.compile(), '21 * 2');
}

exports['multiply integer integer expression using name'] = function (test) {
	var multiply = exprs.multiply(exprs.constant(21, types.Int), exprs.name('two', types.Int));
	
	test.ok(multiply);
	test.equal(typeof multiply, 'object');
	test.strictEqual(multiply.evaluate({ names: { two: 2 } }), 42);
	test.strictEqual(multiply.type(), types.Number);
	test.strictEqual(multiply.compile(), '21 * two');
}

exports['integer divide integer integer expression'] = function (test) {
	var divide = exprs.integerDivide(exprs.constant(84, types.Int), exprs.constant(2, types.Int));
	
	test.ok(divide);
	test.equal(typeof divide, 'object');
	test.strictEqual(divide.evaluate(), 42);
	test.strictEqual(divide.type(), types.Int);
	test.strictEqual(divide.compile(), '84 // 2');
}

exports['integer divide integer integer expression using name'] = function (test) {
	var divide = exprs.integerDivide(exprs.constant(84, types.Int), exprs.name('two', types.Int));
	
	test.ok(divide);
	test.equal(typeof divide, 'object');
	test.strictEqual(divide.evaluate({ names: { two: 2 } }), 42);
	test.strictEqual(divide.type(), types.Int);
	test.strictEqual(divide.compile(), '84 // two');
}

exports['divide integer integer expression'] = function (test) {
	var divide = exprs.divide(exprs.constant(83, types.Int), exprs.constant(2, types.Int));
	
	test.ok(divide);
	test.equal(typeof divide, 'object');
	test.strictEqual(divide.evaluate(), 41.5);
	test.strictEqual(divide.type(), types.Float);
	test.strictEqual(divide.compile(), '83 / 2');
}

exports['divide integer integer expression using name'] = function (test) {
	var divide = exprs.divide(exprs.constant(83, types.Int), exprs.name('two', types.Int));
	
	test.ok(divide);
	test.equal(typeof divide, 'object');
	test.strictEqual(divide.evaluate({ names: { two: 2 } }), 41.5);
	test.strictEqual(divide.type(), types.Float);
	test.strictEqual(divide.compile(), '83 / two');
}

exports['define expression'] = function (test) {
	var def = exprs.define('foo', exprs.constant(42, types.Int));
	
	test.ok(def);
	
	var ctx = {};
	
	var result = def.evaluate(ctx);
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.ok(ctx.names);
	test.ok(ctx.names.foo);
	test.strictEqual(ctx.names.foo, 42);
	
	test.equal(def.compile(), 'var foo = 42');
}

exports['name expression'] = function (test) {
	var name = exprs.name('foo', types.Int);
	
	test.ok(name);
	
	var result = name.evaluate({ names : { foo: 42 } });
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.equal(name.compile(), 'foo');
}

exports['apply expression'] = function (test) {
	var ctx = { names: { add: function (a, b) { return a + b; } } };
	
	var apply = exprs.apply([ exprs.name('add', types.func(types.Int, types.func(types.Int, types.Int))), exprs.constant(41, types.Int), exprs.constant(1, types.Int) ]);
	
	test.ok(apply);
	
	var result = apply.evaluate(ctx);
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.equal(apply.compile(), 'add(41, 1)');
}

exports['dot expression'] = function (test) {
	var dot = exprs.dot(exprs.name('foo'), exprs.name('bar'));
	
	test.ok(dot);
	
	var result = dot.evaluate({ names: { foo: { bar: 42 } } });
	
	test.ok(result);
	test.strictEqual(result, 42);
	
	test.equal(dot.compile(), 'foo.bar');
}

exports['function expression'] = function (test) {
	var func = exprs.func(['a', 'b'], exprs.add(exprs.name('a', types.Int), exprs.name('b', types.Int)));
	
	test.ok(func);
	
	var result = func.evaluate();
	
	test.ok(result);
	test.equal(typeof result, 'function');
	test.equal(result.length, 2);
	test.equal(result.apply(null, [1, 2]), 3);
	
	test.equal(func.compile(), '(function (a, b) { return a + b; })');
}

exports['mod integer integer expression'] = function (test) {
	var mod = exprs.mod(exprs.constant(83, types.Int), exprs.constant(5, types.Int));
	
	test.ok(mod);
	test.equal(typeof mod, 'object');
	test.strictEqual(mod.evaluate(), 3);
	test.strictEqual(mod.type(), types.Int);
	test.strictEqual(mod.compile(), '83 % 5');
}

exports['mod integer integer expression using name'] = function (test) {
	var mod = exprs.mod(exprs.constant(83, types.Int), exprs.name('five', types.Int));
	
	test.ok(mod);
	test.equal(typeof mod, 'object');
	test.strictEqual(mod.evaluate({ names: { five: 5 } }), 3);
	test.strictEqual(mod.type(), types.Int);
	test.strictEqual(mod.compile(), '83 % five');
}

exports['exponentiation number number expression'] = function (test) {
	var exp = exprs.exp(exprs.constant(3, types.Number), exprs.constant(2, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), 9);
	test.strictEqual(exp.type(), types.Number);
	test.strictEqual(exp.compile(), 'Math.pow(3, 2)');
}

exports['exponentiation number number expression using name'] = function (test) {
    var exp = exprs.exp(exprs.constant(3, types.Number), exprs.name('two', types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate({ names: { two: 2 } }), 9);
	test.strictEqual(exp.type(), types.Number);
	test.strictEqual(exp.compile(), 'Math.pow(3, two)');
}

exports['equal with same number'] = function (test) {
    var exp = exprs.equal(exprs.constant(3, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 === 3');
}

exports['equal with different numbers'] = function (test) {
    var exp = exprs.equal(exprs.constant(2, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '2 === 3');
}

exports['equal with same string'] = function (test) {
    var exp = exprs.equal(exprs.constant("foo", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" === "foo"');
}

exports['equal with different strings'] = function (test) {
    var exp = exprs.equal(exprs.constant("foo", types.String), exprs.constant("bar", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" === "bar"');
}

exports['not equal with same number'] = function (test) {
    var exp = exprs.notEqual(exprs.constant(3, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 !== 3');
}

exports['equal with different numbers'] = function (test) {
    var exp = exprs.notEqual(exprs.constant(2, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '2 !== 3');
}

exports['not equal with same string'] = function (test) {
    var exp = exprs.notEqual(exprs.constant("foo", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" !== "foo"');
}

exports['not equal with different strings'] = function (test) {
    var exp = exprs.notEqual(exprs.constant("foo", types.String), exprs.constant("bar", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" !== "bar"');
}

exports['less with numbers'] = function (test) {
    var exp = exprs.less(exprs.constant(2, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '2 < 3');
}

exports['less with integer numbers'] = function (test) {
    var exp = exprs.less(exprs.constant(2, types.Int), exprs.constant(3, types.Int));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '2 < 3');
}

exports['less with equal numbers'] = function (test) {
    var exp = exprs.less(exprs.constant(3, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 < 3');
}

exports['less with strings'] = function (test) {
    var exp = exprs.less(exprs.constant("bar", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"bar" < "foo"');
}

exports['less with equal strings'] = function (test) {
    var exp = exprs.less(exprs.constant("foo", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" < "foo"');
}

exports['greater with numbers'] = function (test) {
    var exp = exprs.greater(exprs.constant(3, types.Number), exprs.constant(2, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 > 2');
}

exports['greater with equal numbers'] = function (test) {
    var exp = exprs.greater(exprs.constant(3, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 > 3');
}

exports['greater with strings'] = function (test) {
    var exp = exprs.greater(exprs.constant("foo", types.String), exprs.constant("bar", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" > "bar"');
}

exports['greater with equal strings'] = function (test) {
    var exp = exprs.greater(exprs.constant("foo", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" > "foo"');
}

exports['less or equal with numbers'] = function (test) {
    var exp = exprs.lessEqual(exprs.constant(1, types.Number), exprs.constant(2, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '1 <= 2');
}

exports['less or equal with equal numbers'] = function (test) {
    var exp = exprs.lessEqual(exprs.constant(3, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 <= 3');
}

exports['less or equal with numbers givin false'] = function (test) {
    var exp = exprs.lessEqual(exprs.constant(3, types.Number), exprs.constant(2, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 <= 2');
}

exports['less or equal with strings'] = function (test) {
    var exp = exprs.lessEqual(exprs.constant("bar", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"bar" <= "foo"');
}

exports['less or equal with equal strings'] = function (test) {
    var exp = exprs.lessEqual(exprs.constant("foo", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" <= "foo"');
}

exports['less or equal with strings giving false'] = function (test) {
    var exp = exprs.lessEqual(exprs.constant("foo", types.String), exprs.constant("bar", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" <= "bar"');
}

exports['greater or equal with numbers'] = function (test) {
    var exp = exprs.greaterEqual(exprs.constant(3, types.Number), exprs.constant(2, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 >= 2');
}

exports['greater or equal with equal numbers'] = function (test) {
    var exp = exprs.greaterEqual(exprs.constant(3, types.Number), exprs.constant(3, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '3 >= 3');
}

exports['greater or equal with numbers givin false'] = function (test) {
    var exp = exprs.greaterEqual(exprs.constant(1, types.Number), exprs.constant(2, types.Number));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '1 >= 2');
}

exports['greater or equal with strings'] = function (test) {
    var exp = exprs.greaterEqual(exprs.constant("foo", types.String), exprs.constant("bar", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" >= "bar"');
}

exports['greater or equal with equal strings'] = function (test) {
    var exp = exprs.greaterEqual(exprs.constant("foo", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), true);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"foo" >= "foo"');
}

exports['greater or equal with strings giving false'] = function (test) {
    var exp = exprs.greaterEqual(exprs.constant("bar", types.String), exprs.constant("foo", types.String));
	
	test.ok(exp);
	test.equal(typeof exp, 'object');
	test.strictEqual(exp.evaluate(), false);
	test.strictEqual(exp.type(), types.Boolean);
	test.strictEqual(exp.compile(), '"bar" >= "foo"');
}

exports['or expression'] = function (test) {
    testOr(false, false, false, 'false || false', test);
    testOr(false, true, true, 'false || true', test);
    testOr(true, false, true, 'true || false', test);
    testOr(true, true, true, 'true || true', test);
}

function testOr(left, right, evaluated, compiled, test) {
	var or = exprs.or(exprs.constant(left, types.Boolean), exprs.constant(right, types.Boolean));
	
	test.ok(or);
	test.equal(typeof or, 'object');
	test.strictEqual(or.evaluate(), evaluated);
	test.strictEqual(or.type(), types.Boolean);
	test.strictEqual(or.compile(), compiled);
}

exports['and expression'] = function (test) {
    testAnd(false, false, false, 'false && false', test);
    testAnd(false, true, false, 'false && true', test);
    testAnd(true, false, false, 'true && false', test);
    testAnd(true, true, true, 'true && true', test);
}

function testAnd(left, right, evaluated, compiled, test) {
	var and = exprs.and(exprs.constant(left, types.Boolean), exprs.constant(right, types.Boolean));
	
	test.ok(and);
	test.equal(typeof and, 'object');
	test.strictEqual(and.evaluate(), evaluated);
	test.strictEqual(and.type(), types.Boolean);
	test.strictEqual(and.compile(), compiled);
}

