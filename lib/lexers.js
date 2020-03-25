
var TokenType = { Name: 1, Integer: 2, Float: 3, String: 4, Symbol: 5, Delimiter: 6, EndOfExpression: 7 };

var delimiters = [ '[', ']', ',', '(', ')', '"' ];

function Lexer(text) {
	var l = text.length;
	var p = 0;
	var indents = [];
	var tokens = [];
	
	this.nextToken = function () {
		if (tokens.length)
			return tokens.pop();
		
		this.skipWhitespaces();
		
		if (p >= l)
			return endOfExpression();
		
		var ch = text[p++];
		
		if (isEndOfLine(ch)) {
			var indentation = getIndentation();
			
			if (!indents.length && indentation || indents[indents.length - 1] < indentation) {
				indents.push(indentation);
                
				this.skipWhitespaces();
                
				if (p >= l)
					return endOfExpression();
                
				ch = text[p++];
			}
			else {
				if (indents.length)
					indents.pop();
                
				return { type: TokenType.EndOfExpression, value: ch };
			}
		}
		
		if (ch === '"')
			if (text[p] === '"' && text[p + 1] === '"') {
				p += 2;
				return nextMultilineString();
			}
			else
				return nextString();
		
		if (isLetter(ch))
			return nextName(ch);
		
		if (isDigit(ch))
			return nextNumber(ch);
		
		if (isDelimiter(ch))
			return { type: TokenType.Delimiter, value: ch };
		
		if (isSymbol(ch))
			return nextSymbol(ch);
	}
	
	this.pushToken = function (token) {
		tokens.push(token);
	};
	
	function endOfExpression() {
		if (indents.length) {
			indents.pop();
			return { type: TokenType.EndOfExpression };
		}
		
		return null;
	}
	
	function isDelimiter(ch) {
		return delimiters.indexOf(ch) >= 0;
	}
	
	function isSymbol(ch) {
		return !isDigit(ch) && !isLetter(ch) && !isWhitespace(ch) && !isEndOfLine(ch) && !isDelimiter(ch);
	}
	
	function isDigit(ch) {
		return ch >= '0' && ch <= '9';
	}
	
	function isLetter(ch) {
		return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
	}
	
	function getIndentation() {
		var pos = p;
		
		while (pos < l && isEndOfLine(text[pos]))
			pos++;
		
		var indentation = 0;
		
		while (pos < l && isWhitespace(text[pos])) {
			pos++;
			indentation++;
		}
		
		return indentation;
	}
	
	function nextString() {
		var value = '';
		
		while (p < l && text[p] !== '"' && !isEndOfLine(text[p]))
			value += text[p++];
		
		if (text[p] !== '"')
			throw new Error('Unclosed String');
		
		p++;
		
		return { type: TokenType.String, value: value };
	}
	
	function nextMultilineString() {
		var value = '';
		
		while (p < l && (text[p] !== '"' || text[p + 1] !== '"' || text[p + 2] !== '"'))
			value += text[p++];
		
		if (text[p] !== '"')
			throw new Error('Unclosed String');
		
		p += 3;
		
		return { type: TokenType.String, value: value };
	}
	
	function nextSymbol(ch) {
		var value = ch;
		
		while (p < l && isSymbol(text[p]))
			value += text[p++];
		
		return { type: TokenType.Symbol, value: value };
	}
	
	function nextNumber(digit) {
		var value = digit;
		
		while (p < l && isDigit(text[p]))
			value += text[p++];
		
		if (text[p] === '.')
			return nextFloat(value + text[p++]);
		
		return { type: TokenType.Integer, value: value };
	}
	
	function nextFloat(value) {
		while (p < l && isDigit(text[p]))
			value += text[p++];

		return { type: TokenType.Float, value: value };
	}
	
	function nextName(letter) {
		var value = letter;
		
		while (p < l && isNameCharacter(text[p]))
			value += text[p++]
		
		return { type: TokenType.Name, value: value };
	}
	
	function isEndOfLine(ch) {
		return ch === '\n' || ch === '\r';
	}
	
	function isNameCharacter(ch) {
		return ch === '_' || isDigit(ch) || isLetter(ch);
	}
	
	function isWhitespace(ch, eols) {
		if (eols && isEndOfLine(ch))
			return true;
		
		return ch <= ' ' && ch !== '\n' && ch !== '\r';
	}
	
	this.skipWhitespaces = function (eols) {
		if (eols)
			while (tokens.length && tokens[tokens.length - 1].type === TokenType.EndOfExpression)
				tokens.pop();
			
		while (true) {
			while (p < l && isWhitespace(text[p], eols))
				p++;
			
			if (p >= l)
				return;
			
			if (text[p] === '-' && text[p + 1] === '-') {
				skipLineComment();
				continue;
			}
			
			if (text[p] === '{' && text[p + 1] === '-') {
				skipComment();
				continue;
			}
			
			break;
		}
		
		function skipLineComment() {
			while (++p < l && !isEndOfLine(text[p]))
				;
		}
		
		function skipComment() {
			p += 2;
			
			while (p < l && !(text[p] === '-' && text[p + 1] === '}'))
				if (text[p] === '{' && text[p + 1] === '-')
					skipComment();
				else
					p++;

			if (p >= l)
				return;
			
			p += 2;
		}
	}
}

function createLexer(text) {
	return new Lexer(text);
}

module.exports = {
	lexer: createLexer,
	TokenType: TokenType
}