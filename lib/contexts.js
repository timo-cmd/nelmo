
function Context(parent) {
	var types = {};
	var values = {};
	
	this.type = function (name, type) {
		if (type)
			types[name] = type;
		else if (types[name] == null && parent)
			return parent.type(name);
		else
			return types[name];
	};
	
	this.value = function (name, type) {
		if (type)
			values[name] = type;
		else if (values[name] == null && parent)
			return parent.value(name);
		else
			return values[name];
	};
}

function createContext(parent) {
	return new Context(parent);
}

module.exports = {
	context: createContext
};

