
var types = require('./types.js');

function compile(expr) {
	var code = expr.compile();
	
	if (expr instanceof ConstantExpression || expr instanceof NameExpression || expr instanceof ApplyExpression)
		return code;
	
	return '(' + code + ')';
}

function ConstantExpression(value, type) {
	this.evaluate = function () { return value; }
	this.type = function () { return type; }
	this.compile = function () { return JSON.stringify(value); }
}

function createConstant(value, type) {
	return new ConstantExpression(value, type);
}

function BinaryComparisonOperatorExpression(left, oper, right) {
	if (!types.comparable(left.type()) || !types.comparable(right.type()))
		throw new Error('Invalid operation');
	
	if (oper === '==')
		this.evaluate = function (ctx) { return left.evaluate(ctx) === right.evaluate(ctx); }
	else if (oper === '/=')
		this.evaluate = function (ctx) { return left.evaluate(ctx) !== right.evaluate(ctx); }
	else if (oper === '<')
		this.evaluate = function (ctx) { return left.evaluate(ctx) < right.evaluate(ctx); }
	else if (oper === '<=')
		this.evaluate = function (ctx) { return left.evaluate(ctx) <= right.evaluate(ctx); }
	else if (oper === '>')
		this.evaluate = function (ctx) { return left.evaluate(ctx) > right.evaluate(ctx); }
	else if (oper === '>=')
		this.evaluate = function (ctx) { return left.evaluate(ctx) >= right.evaluate(ctx); }
	
	this.type = function () { return types.Boolean; }

    if (oper === '==')
        this.compile = function () { return compile(left) + ' === ' + compile(right); }
    else if (oper === '/=')
        this.compile = function () { return compile(left) + ' !== ' + compile(right); }
    else if (oper === '<')
        this.compile = function () { return compile(left) + ' < ' + compile(right); }
    else if (oper === '<=')
        this.compile = function () { return compile(left) + ' <= ' + compile(right); }
    else if (oper === '>')
        this.compile = function () { return compile(left) + ' > ' + compile(right); }
    else if (oper === '>=')
        this.compile = function () { return compile(left) + ' >= ' + compile(right); }
}

function BinaryLogicalOperatorExpression(left, oper, right) {
	if (oper === '||')
		this.evaluate = function (ctx) { return left.evaluate(ctx) || right.evaluate(ctx); }
	else if (oper === '&&')
		this.evaluate = function (ctx) { return left.evaluate(ctx) && right.evaluate(ctx); }
	
	this.type = function () { return types.Boolean; }

    if (oper === '||')
        this.compile = function () { return compile(left) + ' || ' + compile(right); }
    else if (oper === '&&')
        this.compile = function () { return compile(left) + ' && ' + compile(right); }
}

function BinaryNumericOperatorExpression(left, oper, right) {
	if (!types.numeric(left.type()) || !types.numeric(right.type()))
		throw new Error('Invalid operation');
	
	if (oper === '+')
		this.evaluate = function (ctx) { return left.evaluate(ctx) + right.evaluate(ctx); }
	else if (oper === '-')
		this.evaluate = function (ctx) { return left.evaluate(ctx) - right.evaluate(ctx); }
	else if (oper === '*')
		this.evaluate = function (ctx) { return left.evaluate(ctx) * right.evaluate(ctx); }
	else if (oper === '/')
		this.evaluate = function (ctx) { return left.evaluate(ctx) / right.evaluate(ctx); }
	else if (oper === '//')
		this.evaluate = function (ctx) { return Math.floor(left.evaluate(ctx) / right.evaluate(ctx)); }
	else if (oper === '%')
		this.evaluate = function (ctx) { return left.evaluate(ctx) % right.evaluate(ctx); }
	else if (oper === '^')
		this.evaluate = function (ctx) { return Math.pow(left.evaluate(ctx), right.evaluate(ctx)); }
	else if (oper === '==')
		this.evaluate = function (ctx) { return left.evaluate(ctx) === right.evaluate(ctx); }
	
	if (oper === '//' || oper === '%')
		this.type = function () { return types.Int; }
	else if (oper === '/')
		this.type = function () { return types.Float; }
	else if (oper === '==')
		this.type = function () { return types.Boolean; }
	else
		this.type = function () { return types.Number; }

    if (oper === '^')
        this.compile = function () { return 'Math.pow(' + compile(left) + ', ' + compile(right) + ')'; }
    else if (oper === '==')
        this.compile = function () { return compile(left) + ' === ' + compile(right); }
    else
        this.compile = function () { return compile(left) + ' ' + oper + ' ' + compile(right); }
}

function createAdd(left, right) {
	return new BinaryNumericOperatorExpression(left, '+', right);
}

function createSubtract(left, right) {
	return new BinaryNumericOperatorExpression(left, '-', right);
}

function createMultiply(left, right) {
	return new BinaryNumericOperatorExpression(left, '*', right);
}

function createDivide(left, right) {
	return new BinaryNumericOperatorExpression(left, '/', right);
}

function createExponentiation(left, right) {
	return new BinaryNumericOperatorExpression(left, '^', right);
}

function createEqual(left, right) {
	return new BinaryComparisonOperatorExpression(left, '==', right);
}

function createNotEqual(left, right) {
	return new BinaryComparisonOperatorExpression(left, '/=', right);
}

function createOr(left, right) {
	return new BinaryLogicalOperatorExpression(left, '||', right);
}

function createAnd(left, right) {
	return new BinaryLogicalOperatorExpression(left, '&&', right);
}

function createLess(left, right) {
	return new BinaryComparisonOperatorExpression(left, '<', right);
}

function createLessEqual(left, right) {
	return new BinaryComparisonOperatorExpression(left, '<=', right);
}

function createGreater(left, right) {
	return new BinaryComparisonOperatorExpression(left, '>', right);
}

function createGreaterEqual(left, right) {
	return new BinaryComparisonOperatorExpression(left, '>=', right);
}

function createIntegerDivide(left, right) {
	return new BinaryNumericOperatorExpression(left, '//', right);
}

function createIntegerMod(left, right) {
	return new BinaryNumericOperatorExpression(left, '%', right);
}

function DefineExpression(name, expr, expectedType) {
	var type = expr.type();
	
	if (expectedType && !type.equals(expectedType))
		throw new Error('Invalid value');
	
	this.type = function () { return type; };
	
	this.evaluate = function (ctx) {
		if (!ctx.names)
			ctx.names = {};
		
		var value = expr.evaluate(ctx);
		
		ctx.names[name] = value;
		
		return value;
	}
	
	this.compile = function () {
		return 'var ' + name + ' = ' + expr.compile();
	}
}

function createDefine(name, expr, expectedType) {
	return new DefineExpression(name, expr, expectedType);
}

function NameExpression(name, type) {
	this.name = 'name';
	this.type = function () { return type; }
	this.evaluate = function (ctx) { return ctx.names[name]; }
	this.compile = function () { return name; };
}

function createName(name, type) {
	return new NameExpression(name, type);
}

function ApplyExpression(exprs, expectedType) {
	this.name = 'apply';
	
	var type = exprs[0].type();
	
	if (expectedType && type && !type.accepts(expectedType))
		throw new Error('Invalid value');
	
	for (var k = 1; k < exprs.length && type; k++)
		type = type.output();
	
	this.type = function () { return type; };
	
	this.evaluate = function (ctx) {
		var fn = exprs[0].evaluate(ctx);
		var args = [];
		
		for (var k = 1; k < exprs.length; k++)
			args.push(exprs[k].evaluate(ctx));
		
		return fn.apply(null, args);
	}
	
	this.allNames = function () {
		for (var k = 0; k < exprs.length; k++)
			if (exprs[k].name !== 'name')
				return false;
			
		return true;
	}
	
	this.getNames = function () {
		var names = [];
		
		exprs.forEach(function (expr) {
			names.push(expr.compile());
		});
		
		return names;
	}
	
	this.toDefinedFunction = function (fnexpr) {
		var name = exprs[0].compile();

		var names = [];
		
		for (var k = 1; k < exprs.length; k++)
			names.push(exprs[k].compile());
		
		return new DefinedFunctionExpression(name, names, fnexpr);
	}
	
	this.compile = function () {
		var code = exprs[0].compile();
		
		code += '(';
		
		for (var k = 1; k < exprs.length; k++) {
			if (k > 1)
				code += ', ';
			
			code += exprs[k].compile();
		}
		
		code += ')';
		
		return code;
	}
}

function createApply(exprs, expectedType) {
	return new ApplyExpression(exprs, expectedType);
}

function DotExpression(left, right) {
	this.evaluate = function (ctx) {
		return left.evaluate(ctx)[right.compile()];
	}
	
	this.compile = function () {
		var leftcode = left.compile();
		
		if (leftcode === 'Native')
			return right.compile();
		
		if (right instanceof NameExpression)
			return leftcode + '.' + right.compile();
		
		return leftcode + '[' + right.compile() + ']';
	}
	
	this.type = function () {};
}

function createDot(left, right) {
	return new DotExpression(left, right);
}

function FunctionExpression(names, expr) {
	var type = expr.type();
	
	this.type = function () { return type; };
	
	this.evaluate = function () {
		var args = names.slice();
		args.push('return ' + expr.compile() + ';');
		return Function.apply(Function, args);
	};
	
	this.compile = function () {
		var code = '(function (';
		
		for (var n = 0; n < names.length; n++) {
			if (n)
				code += ', ';
			code += names[n];
		}
		
		code += ') { return ' + expr.compile() + '; })';
		
		return code;
	};
}

function DefinedFunctionExpression(name, argnames, expr) {
	var type = expr.type();
	
	this.type = function () { return type; };
	
	this.compile = function () {
		var code = 'function ' + name + '(';
		
		for (var n = 0; n < argnames.length; n++) {
			if (n)
				code += ', ';
			code += argnames[n];
		}
		
		code += ') { return ' + expr.compile() + '; }';
		
		return code;
	};
}

function createFunction(names, expr) {
	return new FunctionExpression(names, expr);
}

module.exports = {
	constant: createConstant,
	
	add: createAdd,
	subtract: createSubtract,
	multiply: createMultiply,
	divide: createDivide,
	integerDivide: createIntegerDivide,
	mod: createIntegerMod,
    exp: createExponentiation,
    
    equal: createEqual,
    notEqual: createNotEqual,
    less: createLess,
    lessEqual: createLessEqual,
    greater: createGreater,
    greaterEqual: createGreaterEqual,

    or: createOr,
    and: createAnd,
    
	define: createDefine,
	name: createName,
	apply: createApply,
	dot: createDot,
	func: createFunction
};

