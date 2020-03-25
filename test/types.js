
var types = require('../lib/types');

exports['String is a type'] = function (test) {
	test.ok(types.String);
	test.equal(typeof types.String, 'object');
}

exports['Bool is a type'] = function (test) {
	test.ok(types.Bool);
	test.equal(typeof types.Bool, 'object');
}

exports['Int is a type'] = function (test) {
	test.ok(types.Int);
	test.equal(typeof types.Int, 'object');
}

exports['Float is a type'] = function (test) {
	test.ok(types.Float);
	test.equal(typeof types.Float, 'object');
}

exports['number is a type'] = function (test) {
	test.ok(types.Number);
	test.equal(typeof types.Number, 'object');
}

exports['functional type'] = function (test) {
	var func = types.func(types.Int, types.Int);
	
	test.ok(func);
	test.equal(typeof func, 'object');
	test.strictEqual(func.input(), types.Int);
	test.strictEqual(func.output(), types.Int);
}

exports['primitive types equal'] = function (test) {
	test.strictEqual(types.Int.equals(types.Int), true);
	test.strictEqual(types.Float.equals(types.Float), true);
	test.strictEqual(types.String.equals(types.String), true);
	test.strictEqual(types.Bool.equals(types.Bool), true);

	test.strictEqual(types.Int.equals(types.Float), false);
	test.strictEqual(types.Float.equals(types.Int), false);
	test.strictEqual(types.Int.equals(types.Number), false);
	test.strictEqual(types.Float.equals(types.Number), false);
	test.strictEqual(types.Int.equals(types.String), false);
	test.strictEqual(types.Float.equals(types.String), false);
}

exports['functional types equal'] = function (test) {
	var func1 = types.func(types.Int, types.Int);
	var func2 = types.func(types.Int, types.Int);
	var func3 = types.func(types.String, types.Int);
	var func4 = types.func(types.String, types.func(types.Int, types.Float));
	var func5 = types.func(types.String, types.func(types.Int, types.Float));
	var func6 = types.func(types.String, types.func(types.Int, types.String));
	
	test.strictEqual(func1.equals(func2), true);
	test.strictEqual(func2.equals(func1), true);
	test.strictEqual(func1.equals(func3), false);
	test.strictEqual(func3.equals(func1), false);
	
	test.strictEqual(func4.equals(func5), true);
	test.strictEqual(func5.equals(func4), true);
	test.strictEqual(func4.equals(func6), false);
	test.strictEqual(func6.equals(func4), false);
}

exports['functional type not equal to primitive ones'] = function (test) {
	var func = types.func(types.Int, types.Int);
	
	test.strictEqual(func.equals(types.Int), false);
	test.strictEqual(func.equals(types.Float), false);
	test.strictEqual(func.equals(types.Number), false);
	test.strictEqual(func.equals(types.String), false);
}

exports['list type'] = function (test) {
	var list = types.list(types.String);
	
	test.ok(list);
	test.equal(typeof list, 'object');
	test.strictEqual(list.type(), types.String);
}

exports['list type equal'] = function (test) {
	var list1 = types.list(types.String);
	var list2 = types.list(types.String);
	var list3 = types.list(types.Int);
	var list4 = types.list(types.Bool);
	
	test.strictEqual(list1.equals(list1), true);
	test.strictEqual(list1.equals(list2), true);
	test.strictEqual(list2.equals(list1), true);
	test.strictEqual(list1.equals(list3), false);
	test.strictEqual(list2.equals(list3), false);
	test.strictEqual(list2.equals(list4), false);
}

exports['list type is not equal to primitive ones'] = function (test) {
	var list = types.list(types.String);
	
	test.strictEqual(list.equals(types.Int), false);
	test.strictEqual(list.equals(types.Float), false);
	test.strictEqual(list.equals(types.Number), false);
	test.strictEqual(list.equals(types.String), false);
	test.strictEqual(list.equals(types.Bool), false);
}

exports['numeric predicate'] = function (test) {
	test.strictEqual(types.numeric(types.Int), true);
	test.strictEqual(types.numeric(types.Float), true);
	test.strictEqual(types.numeric(types.Number), true);

	test.strictEqual(types.numeric(types.String), false);
	test.strictEqual(types.numeric(types.func(types.Int, types.Int)), false);
	test.strictEqual(types.numeric(types.list(types.String)), false);
	test.strictEqual(types.numeric(types.list(types.Bool)), false);
}

exports['comparable predicate'] = function (test) {
	test.strictEqual(types.comparable(types.Int), true);
	test.strictEqual(types.comparable(types.Float), true);
	test.strictEqual(types.comparable(types.Number), true);
	test.strictEqual(types.comparable(types.list(types.String)), true);
	test.strictEqual(types.comparable(types.list(types.Bool)), true);

	test.strictEqual(types.comparable(types.Bool), false);
	test.strictEqual(types.comparable(types.func(types.Int, types.Int)), false);
}

exports['from string'] = function (test) {
	test.strictEqual(types.fromString('Int'), types.Int);
	test.strictEqual(types.fromString('Float'), types.Float);
	test.strictEqual(types.fromString('number'), types.Number);
	test.strictEqual(types.fromString('String'), types.String);
	test.strictEqual(types.fromString('Bool'), types.Bool);
}

exports['primitive types to string'] = function (test) {
	test.strictEqual(types.Int.toString(), 'Int');
	test.strictEqual(types.Float.toString(), 'Float');
	test.strictEqual(types.Number.toString(), 'number');
	test.strictEqual(types.String.toString(), 'String');
	test.strictEqual(types.Bool.toString(), 'Bool');
}

exports['functional types to string'] = function (test) {
	test.strictEqual(types.func(types.Int, types.String).toString(), 'Int -> String');
	test.strictEqual(types.func(types.Int, types.func(types.String, types.Float)).toString(), 'Int -> String -> Float');
}

exports['match types to numeric'] = function (test) {
	test.strictEqual(types.Int.match(types.Number), true);
	test.strictEqual(types.Float.match(types.Number), true);
	test.strictEqual(types.Number.match(types.Number), true);

	test.strictEqual(types.Bool.match(types.Number), false);
	test.strictEqual(types.String.match(types.Number), false);
	test.strictEqual(types.list(types.Int).match(types.Number), false);
	test.strictEqual(types.func(types.Int, types.Int).match(types.Number), false);
}

