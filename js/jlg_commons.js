Array.prototype.find = function(callback) {
	for (var i = 0; i < this.length; i++) {
		if (callback(this[i])) {
			return this[i];
		}
	}
	return undefined;
};

Array.prototype.findAll = function(callback) {
	var result = [];
	for (var i = 0; i < this.length; i++) {
		if (callback(this[i])) {
			result.push(this[i]);
		}
	}
	return result;
};

String.prototype.padleft = function(length, character) {
	return new Array(length - this.length + 1).join(character || '0') + this;
};

String.prototype.padright = function(length, character) {
	return this + (new Array(length - this.length + 1)).join(character || '0');
};


Math.randomize = function(min, max) {
	if (min === undefined) {
		return Math.random();
	}
	if (max === undefined) {
		throw new Error('No max specified.');
	}
	return Math.random() * (max - min) + min;
};