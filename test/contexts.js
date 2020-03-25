
var contexts = require('../lib/contexts');
var types = require('../lib/types');

exports['get unknown type'] = function (test) {
	var ctx = contexts.context();
	
	test.equal(ctx.type('Id'), null);
}

exports['set and get Int type'] = function (test) {
	var ctx = contexts.context();
	
	ctx.type('Id', types.Int)
	test.strictEqual(ctx.type('Id'), types.Int);
}

exports['get type from unknown value'] = function (test) {
	var ctx = contexts.context();
	
	test.equal(ctx.value('answer'), null);
}

exports['set and get Int value'] = function (test) {
	var ctx = contexts.context();
	
	ctx.value('answer', types.Int)
	test.strictEqual(ctx.value('answer'), types.Int);
}

exports['use parent'] = function (test) {
	var parent = contexts.context();
	var ctx = contexts.context(parent);
	
	test.equal(ctx.value('answer'), null);
	test.equal(parent.value('answer'), null);
	
	parent.value('answer', types.Int);

	test.strictEqual(parent.value('answer'), types.Int);
	test.strictEqual(ctx.value('answer'), types.Int);
	
	parent.type('Name', types.String);

	test.strictEqual(parent.type('Name'), types.String);
	test.strictEqual(ctx.type('Name'), types.String);
	
	ctx.type('Bar', types.Int);
	
	test.equal(parent.type('Bar'), null);
	test.strictEqual(ctx.type('Bar'), types.Int);
	
	ctx.value('foo', types.Int);
	
	test.equal(parent.value('foo'), null);
	test.strictEqual(ctx.value('foo'), types.Int);
}


