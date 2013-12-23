function Thread(name, parentThread) {
	var self = this;
	this.name = name;
	this.orders = [];
	this.parentThread = parentThread;

	this.isFinished = false;

	this.push = function(order) {
		this.orders.push(order);
	};

	this.unshift = function(order) {
		this.orders.unshift(order);
	};

	this._next = function() {
		var order = this.orders.shift();
		if (order) {
			console.log(this.name + ': Executing order: ' + order.name);
			if (order.args instanceof Object) {
				order.args = Array.prototype.slice.call(order.args);
			}
			// add the thread before all other arguments.
			order.args.unshift(this);
			order.function.apply(order.object, order.args);
		} else {
			this.isFinished = true;
			console.log(this.name + ': No order anymore.');
		}
	}

	this.start = function() {
		setTimeout(function() {
			self._next();
		}, 0);
	};

	this.startThread = function(thread) {
		this.push({
			function: function(t) {
				var thread = this.getThread(arguments);
				t.start();
				thread._next();
			},
			args: arguments,
			name: 'startThread',
			object: this
		});
	};

	this.getThread = function() {
		// return the thread. Call this with the keyword argument inside.
		var args = arguments.callee.caller.arguments;
		var result = Array.prototype.shift.call(args);
		return result;
	};

	this.wait = function() {
		this.push({
			function: function() {},
			args: [],
			name: 'wait',
			object: this
		});

		for (var i = 0; i < arguments.length; i++) {
			var thread = arguments[i];
			thread.push({
				function: function() {
					var thread = this.getThread(arguments);

					thread.isFinished = true;
					var allFinished = true;
					for (var i = 0; i < arguments.length; i++) {
						var t = arguments[i];
						if (t.isFinished == false) {
							allFinished = false;
							break;
						}
					}

					if (allFinished) {
						//console.log(this.name + ': Wait released.');
						this._next();
					}
				},
				args: arguments,
				name: 'checkwait',
				object: this
			})
		}
	};
}