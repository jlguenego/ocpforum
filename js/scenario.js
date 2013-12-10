function Scenario() {
	var self = this;

	this.threads = {
		main: {
			orders: [],
			state: false,
			name: 'main'
		}
	};

	this.current = this.threads.main;

	this.setThread = function(threadName) {
		if (!(threadName in this.threads)) {
			this.threads[threadName] = {
				orders: [],
				state: false,
				name: threadName
			};

			this.threads.main.orders.push({
				function: this._startThread,
				args: arguments,
				name: 'startThread',
				object: this
			});
		}
		this.current = this.threads[threadName];
	};

	this._startThread = function(threadName) {
		var scenario = this.getThread(arguments);
		setTimeout(function() {
			var s = new Scenario();
			s.threads = self.threads;
			s.current = self.threads[threadName];
			s.start();
		}, 0);
		scenario._next();
	};

	this.push = function(order) {
		this.current.orders.push(order);
	};

	this.unshift = function(order) {
		this.current.orders.unshift(order);
	};

	this.start = function() {
		this._next();
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
			var thread = this.threads[arguments[i]];
			thread.orders.push({
				function: function() {
					var scenario = this.getThread(arguments);

					scenario.current.state = true;
					console.log('checking wait');
					var allFinished = true;
					for (var i = 0; i < arguments.length; i++) {
						var thread = this.threads[arguments[i]];
						if (thread.state == false) {
							allFinished = false;
							break;
						}
					}

					if (allFinished) {
						console.log('wait finished');
						this._next();
					}
				},
				args: arguments,
				name: 'checkwait',
				object: this
			})
		}
	};

	this._next = function() {
		var order = this.current.orders.shift();
		if (order) {
			if (order.args instanceof Object) {
				order.args = Array.prototype.slice.call(order.args);
			}
			order.args.unshift(this);
			order.function.apply(order.object, order.args);
		} else {
			this.current.state = true;
			console.log('no order anymore.');
		}
	};

	this.getThread = function() {
		var args = arguments.callee.caller.arguments;
		var result = Array.prototype.shift.call(args);
		return result;
	};
};