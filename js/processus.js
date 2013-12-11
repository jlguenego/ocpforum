function Thread(name, parentThread) {
	var self = this;
	this.name = name;
	this.orders = [];
	this.parentThread = parentThread;

	this.isFinished = false;

	this.push = function(order) {
		console.log('push new order in thread ' + this.name);
		console.log(order);
		this.orders.push(order);
	};

	this.unshift = function(order) {
		this.orders.unshift(order);
	};

	this._next = function() {
		var order = this.orders.shift();
		if (order) {
			if (order.args instanceof Object) {
				order.args = Array.prototype.slice.call(order.args);
			}
			// add the thread before all other arguments.
			order.args.unshift(this);
			order.function.apply(order.object, order.args);
		} else {
			this.isFinished = true;
			console.log(this.name + ': no order anymore.');
			console.log(this);
		}
	}

	this.start = function() {

		setTimeout(function() {
			console.log('starting thread ' + self.name);
			console.log('orders: ');
			for (var i = 0; i < self.orders.length; i++) {
				console.log(self.orders[i]);
			}
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
			function: function() {
				console.log('waiting...');
			},
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
					console.log(thread.name + ': checking wait');
					var allFinished = true;
					for (var i = 0; i < arguments.length; i++) {
						var t = arguments[i];
						if (t.isFinished == false) {
							allFinished = false;
							break;
						}
					}

					if (allFinished) {
						console.log(this.name + ': wait finished');
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