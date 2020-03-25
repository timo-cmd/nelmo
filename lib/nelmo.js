
var parsers = require('./parsers');

function compileText(text) {
	var parser = parsers.parser(text);
	
	var result = [];
	
	for (var expr = parser.parseExpression(); expr != null; expr = parser.parseExpression())
		if (expr)
			result.push(expr.compile());
	
	if (result.length === 0)
		return '';
	
	result = result.join(';\n') + ';\n';
	
	return result;
}

function evaluateText(text) {
	var parser = parsers.parser(text);
    
    var expr = parser.parseExpression();
    
    return expr.evaluate();
}

module.exports = {
	compile: compileText,
    evaluate: evaluateText
};
