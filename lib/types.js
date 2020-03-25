
function PrimitiveType(name) {
	this.toString = function () { return name; };
	this.equals = function (type) { return this === type; };
	this.match = function (type) { return this.equals(type); };
}

var stringType = new PrimitiveType('String');

var boolType = new PrimitiveType('Bool');

// numeric types
var intType = new PrimitiveType('Int');
var floatType = new PrimitiveType('Float');
var numberType = new PrimitiveType('number');

intType.match = floatType.match = numberType.match = function (type) { return type === numberType || this.equals(type); };

var strings = {
	String: stringType,
	Int: intType,
	Float: floatType,
	number: numberType,
    Bool: boolType
}

function FunctionType(input, output) {
	this.input = function () { return input; };
	this.output = function () { return output; };
	
	this.toString = function () {
		return input.toString() + ' -> ' + output.toString();
	}
	
	this.accepts = function (type) {
		if (type instanceof FunctionType) {
			if (!input.equals(type.input()))
				return false;
			
			if (output instanceof FunctionType)
				return output.accepts(type.output());
			
			return false;
		}
			
		return input.equals(type);
	}
	
	this.equals = function (type) {
		if (!(type instanceof FunctionType))
			return false;
		
		return input.equals(type.input()) && output.equals(type.output());
	}
	
	this.match = function (type) { return this.equals(type); };
}

function ListType(type) {
	this.type = function () { return type; };
	
	this.equals = function (tp) {
		if (tp instanceof ListType)
			return type.equals(tp.type());
		
		return false;
	}
	
	this.match = function (type) { return this.equals(type); };
}

function createFunctionType(input, output) {
	return new FunctionType(input, output);
}

function createListType(type) {
	return new ListType(type);
}

function isNumeric(type) {
	return type.match(numberType);
}

function isComparable(type) {
    return type === stringType || type === intType || type == floatType || type == numberType || type instanceof ListType;
}

function fromString(text) {
	return strings[text];
}

module.exports = {
	String: stringType,
    Bool: boolType,
	Int: intType,
	Float: floatType,
	Number: numberType,
	
	func: createFunctionType,
	list: createListType,
	
	numeric: isNumeric,
    comparable: isComparable,
	
	fromString: fromString	
};

