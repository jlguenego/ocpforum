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

Math.randomizeInt = function(min, max) {
	if (min === undefined) {
		return Math.random();
	}
	if (max === undefined) {
		throw new Error('No max specified.');
	}
	return Math.floor(Math.random() * (max - min + 1) + min);
};


var jlg = {
};

(function(jlg, undefined) {
	// Warning: does not work if circular references.
	jlg.deepCopy = function(obj) {
		return JSON.parse(JSON.stringify(obj));
	};

	jlg.accessor = function(accessor) {
		return function(d) { return d[accessor]; };
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

	jlg.log2 = function(n) {
		return Math.log(n) / Math.LN2;
	};

	jlg.max = function(array) {
		return Math.max.apply(null, array);
	};

	jlg.min = function(array) {
		return Math.min.apply(null, array);
	};

	jlg.Sequence = function(start) {
		var seq = start || 0;

		this.reset = function(start) {
			seq = start || 0;
		};

		this.next= function() {
			var result = seq;
			seq++;
			return result;
		};
	};

	jlg.round = function(nbr, decimal_nbr) {
		if (decimal_nbr == undefined) {
			decimal_nbr = 2;
		}
		return parseFloat(parseFloat(nbr).toFixed(decimal_nbr));
	};

	jlg.avg = function(nbrs, coefs) {
		coefs = coefs || [];
		var sum = 0;
		var coef_sum = 0;
		for (var i = 0; i < nbrs.length; i++) {
			var coef = coefs[i] || 1;
			coef_sum += coef;
			sum += (coef * nbrs[i]);
		}
		return sum / coef_sum;
	};
})(jlg);