
var types = require('./types');
var exprs = require('./exprs');
var contexts = require('./contexts');
var lexers = require('./lexers');
var TokenType = lexers.TokenType;

function BinaryOperator(factory, assoc, precedence) {
	this.precedence = function () { return precedence; }
	this.expr = function (left, right) { return factory(left, right); }
	this.assoc = function () { return assoc; }
}

var opers = {
	'+': new BinaryOperator(exprs.add, 1, 0),
	'-': new BinaryOperator(exprs.subtract, 1, 0),
	'*': new BinaryOperator(exprs.multiply, 1, 1),
	'/': new BinaryOperator(exprs.divide, 1, 1),
	'//': new BinaryOperator(exprs.integerDivide, 1, 1),
	'%': new BinaryOperator(exprs.mod, 1, 1),
	'^': new BinaryOperator(exprs.exp, 1, 1),
	'==': new BinaryOperator(exprs.equal, 1, 1),
	'/=': new BinaryOperator(exprs.notEqual, 1, 1),
	'<': new BinaryOperator(exprs.less, 1, 1),
	'<=': new BinaryOperator(exprs.lessEqual, 1, 1),
	'>': new BinaryOperator(exprs.greater, 1, 1),
	'>=': new BinaryOperator(exprs.greaterEqual, 1, 1),
	'||': new BinaryOperator(exprs.or, 1, 1),
	'&&': new BinaryOperator(exprs.and, 1, 1),
}

function Parser(text, ctx) {
	ctx = ctx || contexts.context();
	
	var lexer = lexers.lexer(text);
	var self = this;
	
	this.parseExpression = function () {
		lexer.skipWhitespaces(true);
		
		if (parseName('type'))
			return parseNamedType();
		
		if (tryParseToken(TokenType.Symbol, '\\'))
			return parseAnonymousFunction();
		
		var expr = parseBinaryExpression(0);
		
		if (!expr)
			return expr;
				
		var token = lexer.nextToken();
		
		if (token && token.type !== TokenType.EndOfExpression && token.type !== TokenType.Delimiter)
			throw new Error("Unexpected '" + token.value + "'");
		
		if (token && token.type === TokenType.Delimiter)
			lexer.pushToken(token);

		return expr;
	}
	
	function parseAnonymousFunction() {
		var names = [];
		
		var name = tryParseName();
		
		while (name) {
			names.push(name);
			name = tryParseName();
		}
		
		parseToken(TokenType.Symbol, '->');
		
		var expr = self.parseExpression();
		
		return exprs.func(names, expr);
	}
	
	function argTypes(args, index) {
		if (args.length <= index)
			return null;
		
		if (args.length - 1 === index)
			return args[index].type();			
		
		return types.func(args[index].type(), argTypes(args, index + 1));
	}
	
	function parseName(name) {
		var token = lexer.nextToken();
		
		if (token && token.type === TokenType.Name)
			if (name && token.value === name)
				return true;
			else if (!name)
				return token.value;
		
		if (token)
			lexer.pushToken(token);
		
		return false;
	}
	
	function tryParseName() {
		var token = lexer.nextToken();
		
		if (token && token.type === TokenType.Name)
			return token.value;
		
		if (token)
			lexer.pushToken(token);
		
		return null;
	}
	
	function parseNamedType() {
		var name = parseName();
		
		parseToken(TokenType.Symbol, '=');
		
		var type = parseType();
		
		ctx.type(name, type);
		
		return false;
	}
	
	function parseType() {
		var typename = parseName();
		
		var type = types.fromString(typename);
		
		if (tryParseToken(TokenType.Symbol, '->'))
			type = types.func(type, parseType());
		
		return type;
	}
	
	function parseBinaryExpression(level) {
		if (level > 1)
			return parseSequence();
		
		var expr = parseBinaryExpression(level + 1);
		
		if (!expr)
			return null;
		
		if (level === 0 && tryParseToken(TokenType.Symbol, ':')) {
			var type = parseType();
			ctx.value(expr.compile(), type);
			return false;
		}
		
		var token = lexer.nextToken();
		
		while (token && token.type === TokenType.Symbol) {
			if (level === 0 && token.value === '=') {
				if (expr.name === 'apply' && expr.allNames()) {
					var names = expr.getNames();
					var originalctx = ctx;
					ctx = contexts.context(ctx);
					var fntype = originalctx.value(names[0]);
					
					for (var k = 1; k < names.length; k++) {
						ctx.value(names[k], fntype.input());
						fntype = fntype.output();
					}
					
					var fnexpr = self.parseExpression();
					
					ctx = originalctx;
					
					return expr.toDefinedFunction(fnexpr);
				}
				
				var name = expr.compile();
				var valueexpr = self.parseExpression();
				return exprs.define(name, valueexpr, ctx.value(name));
			}
			else {
				var oper = opers[token.value];
				
				if (!oper || oper.precedence() != level)
					break;
				
				expr = oper.expr(expr, parseBinaryExpression(level + oper.assoc()));
			}
			
			token = lexer.nextToken();
		}
		
		if (token)
			lexer.pushToken(token);
		
		return expr;
	}
	
	function parseSequence() {
		var expr = parseTerm();
		
		if (expr == null)
			return null;
		
		for (var term = parseTerm(); term; term = parseTerm())
			if (Array.isArray(expr))
				expr.push(term);
			else
				expr = [expr, term];
			
		if (!Array.isArray(expr))
			return expr;
			
		return exprs.apply(expr, argTypes(expr, 1));
	}
	
	function parseTerm() {
		var expr = parseSimpleTerm();
		
		if (expr == null)
			return null;
		
		var token = lexer.nextToken();
		
		while (token && token.type === TokenType.Symbol && token.value === '.') {
			expr = exprs.dot(expr, parseSimpleTerm());
			token = lexer.nextToken();
		}
		
		if (token)
			lexer.pushToken(token);
		
		return expr;
	}
	
	function parseSimpleTerm() {
		var token = lexer.nextToken();
		
		if (!token)
			return null;

		if (token.type === TokenType.Delimiter && token.value === '(') {
			var expr = self.parseExpression();
			parseToken(TokenType.Delimiter, ')');
			return expr;
		}
		
		if (token.type === TokenType.Integer)
			return exprs.constant(parseInt(token.value), types.Int);
		else if (token.type === TokenType.Float)
			return exprs.constant(parseFloat(token.value), types.Float);
		else if (token.type === TokenType.String)
			return exprs.constant(token.value, types.String);
		else if (token.type === TokenType.Name) {
            if (token.value === 'False')
                return exprs.constant(false, types.Boolean);
            if (token.value === 'True')
                return exprs.constant(true, types.Boolean);
			return exprs.name(token.value, ctx.value(token.value));
        }
		
		lexer.pushToken(token);
		
		return null;
	}
	
	function parseToken(type, value) {
		var token = lexer.nextToken();
		
		if (token && token.type === type && token.value === value)
			return;
		
		if (token)
			lexer.pushToken(token);
		
		throw new Error("Expected '" + value + "'");
	}

	function tryParseToken(type, value) {
		var token = lexer.nextToken();
		
		if (token && token.type === type && token.value === value)
			return true;
		
		if (token)
			lexer.pushToken(token);
		
		return false;
	}
}

function createParser(text, ctx) {
	return new Parser(text, ctx);
}

module.exports = {
	parser: createParser
};

