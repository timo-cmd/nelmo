
var lexers = require('../lib/lexers');
var TokenType = lexers.TokenType;

exports['get integer'] = function (test) {
	var lexer = lexers.lexer('42');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['get integer with spaces'] = function (test) {
	var lexer = lexers.lexer('  42   ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['get integer skipping line comment'] = function (test) {
	var lexer = lexers.lexer('42 -- line comment');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['skip line comment and get integer'] = function (test) {
	var lexer = lexers.lexer('-- line comment\n42');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '\n');
	test.equal(token.type, TokenType.EndOfExpression);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['skip comment and get integer'] = function (test) {
	var lexer = lexers.lexer('{- a comment -}42');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['skip nested comment and get integer'] = function (test) {
	var lexer = lexers.lexer('{- a comment {- a nested\ncomment -}-}42');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	test.equal(lexer.nextToken(), null);
}

exports['get float'] = function (test) {
	var lexer = lexers.lexer('3.14159');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '3.14159');
	test.equal(token.type, TokenType.Float);
	
	test.equal(lexer.nextToken(), null);
}

exports['get float with spaces'] = function (test) {
	var lexer = lexers.lexer('  3.14159   ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '3.14159');
	test.equal(token.type, TokenType.Float);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name'] = function (test) {
	var lexer = lexers.lexer('foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name with spaces'] = function (test) {
	var lexer = lexers.lexer('   foo    ');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name with digits'] = function (test) {
	var lexer = lexers.lexer('foo42');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo42');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get name with underscore'] = function (test) {
	var lexer = lexers.lexer('foo_bar');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo_bar');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['underscore before name is a symbol'] = function (test) {
	var lexer = lexers.lexer('_foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '_');
	test.equal(token.type, TokenType.Symbol);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get integer and name'] = function (test) {
	var lexer = lexers.lexer('42 foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '42');
	test.equal(token.type, TokenType.Integer);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get float and name'] = function (test) {
	var lexer = lexers.lexer('3.14159 foo');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '3.14159');
	test.equal(token.type, TokenType.Float);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get string'] = function (test) {
	var lexer = lexers.lexer('"foo"');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.String);
	
	test.equal(lexer.nextToken(), null);
}

exports['unclosed string'] = function (test) {
	var lexer = lexers.lexer('"foo');
	
	try {
		lexer.nextToken();
		test.fail();
	}
	catch (ex) {
		test.equal(ex.toString(), "Error: Unclosed String");
	}
}

exports['unclosed string with new line'] = function (test) {
	var lexer = lexers.lexer('"foo\n"');
	
	try {
		lexer.nextToken();
		test.fail();
	}
	catch (ex) {
		test.equal(ex.toString(), "Error: Unclosed String");
	}
}

exports['unclosed string with carriage return'] = function (test) {
	var lexer = lexers.lexer('"foo\n"');
	
	try {
		lexer.nextToken();
		test.fail();
	}
	catch (ex) {
		test.equal(ex.toString(), "Error: Unclosed String");
	}
}

exports['get multiline string'] = function (test) {
	var lexer = lexers.lexer('"""foo\nbar"""');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo\nbar');
	test.equal(token.type, TokenType.String);
	
	test.equal(lexer.nextToken(), null);
}

exports['unclosed multiline string'] = function (test) {
	var lexer = lexers.lexer('"""foo\nbar"');
	
	try {
		lexer.nextToken();
		test.fail();
	}
	catch (ex) {
		test.equal(ex.toString(), "Error: Unclosed String");
	}
}

exports['get symbol'] = function (test) {
	var lexer = lexers.lexer('+');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '+');
	test.equal(token.type, TokenType.Symbol);
	
	test.equal(lexer.nextToken(), null);
}

exports['get symbol with two characters'] = function (test) {
	var lexer = lexers.lexer('::');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '::');
	test.equal(token.type, TokenType.Symbol);
	
	test.equal(lexer.nextToken(), null);
}

exports['get comma as delimiter'] = function (test) {
	var lexer = lexers.lexer(',');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, ',');
	test.equal(token.type, TokenType.Delimiter);
	
	test.equal(lexer.nextToken(), null);
}

exports['get left square bracket as delimiter'] = function (test) {
	var lexer = lexers.lexer('[');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '[');
	test.equal(token.type, TokenType.Delimiter);
	
	test.equal(lexer.nextToken(), null);
}

exports['get right square bracket as delimiter'] = function (test) {
	var lexer = lexers.lexer(']');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, ']');
	test.equal(token.type, TokenType.Delimiter);
	
	test.equal(lexer.nextToken(), null);
}

exports['get parentheses as delimiters'] = function (test) {
	var lexer = lexers.lexer('()');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '(');
	test.equal(token.type, TokenType.Delimiter);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, ')');
	test.equal(token.type, TokenType.Delimiter);
	
	test.equal(lexer.nextToken(), null);
}

exports['get lambda and name'] = function (test) {
	var lexer = lexers.lexer('\\n');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '\\');
	test.equal(token.type, TokenType.Symbol);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'n');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get names without indentation'] = function (test) {
	var lexer = lexers.lexer('foo\nbar');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, '\n');
	test.equal(token.type, TokenType.EndOfExpression);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'bar');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}

exports['get names with indentation'] = function (test) {
	var lexer = lexers.lexer('foo\n bar');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'bar');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.type, TokenType.EndOfExpression);
	
	test.equal(lexer.nextToken(), null);
}

exports['get names with two nested indentations'] = function (test) {
	var lexer = lexers.lexer('foo\n bar\n  baz');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'bar');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'baz');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.type, TokenType.EndOfExpression);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.type, TokenType.EndOfExpression);
	
	test.equal(lexer.nextToken(), null);
}

exports['get names with two same level indentations'] = function (test) {
	var lexer = lexers.lexer('foo\n bar\n baz');
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'foo');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'bar');
	test.equal(token.type, TokenType.Name);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.equal(token.type, TokenType.EndOfExpression);
	
	var token = lexer.nextToken();
	
	test.ok(token);
	test.strictEqual(token.value, 'baz');
	test.equal(token.type, TokenType.Name);
	
	test.equal(lexer.nextToken(), null);
}
