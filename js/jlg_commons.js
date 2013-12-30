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


var jlg = {
};

(function(jlg, undefined) {
	// Warning: does not work if circular references.
	jlg.deepCopy = function(obj) {
		return JSON.parse(JSON.stringify(obj));
	};

	jlg.find = function(array, callback) {
		for (var i = 0; i < array.length; i++) {
			if (callback(array[i])) {
				return array[i];
			}
		}
		return undefined;
	};

	jlg.findAll = function(array, callback) {
		var result = [];
		for (var i = 0; i < array.length; i++) {
			if (callback(array[i])) {
				result.push(array[i]);
			}
		}
		return result;
	};

	jlg.max = function(array) {
		return Math.max.apply(null, array);
	};

	jlg.min = function() {
		return Math.min.apply(null, array);
	};



})(jlg);