Array.prototype.find = function(callback) {
	for (var i = 0; i < this.length; i++) {
		if (callback(this[i])) {
			return this[i];
		}
	}
	return undefined;
};

String.prototype.padleft = function(length, character) {
	return new Array(length - this.length + 1).join(character || '0') + this;
};

String.prototype.padright = function(length, character) {
	return this + (new Array(length - this.length + 1)).join(character || '0');
};