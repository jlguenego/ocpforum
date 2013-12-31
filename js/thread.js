function Thread(name, parentThread) {
	var self = this;
	this.name = name;
	this.orders = [];
	this.parentThread = parentThread;

	this.isFinished = false;

	this.debug = null;

	this.push = function(order) {
		this.orders.push(order);
	};

	this.unshift = function(order) {
		this.orders.unshift(order);
	};

	this.setDebug = function(selector) {
		this.debug = selector;
		$(this.debug).click(function() {
			self.next();
		});
	};

	this.next = function() {
		if (!this.debug) {
			this._next();
		}
	}

	this._next = function() {
		var order = this.orders.shift();
		if (order) {
			console.log(this.name + ': Executing order: ' + order.name);
			order.function.apply(order.object, order.args);
		} else {
			this.isFinished = true;
			console.log(this.name + ': No order anymore.');
		}
	};



	this.start = function() {
		setTimeout(function() {
			self.next();
		}, 0);
	};

	this.startThread = function(t) {
		this.push({
			function: function(t) {
				t.start();
				self.next();
			},
			args: arguments,
			name: 'startThread',
			object: this
		});
		console.log('push start thread');
	};

	this.do_startThread = function(t) {
		this.unshift({
			function: function(t) {
				t.start();
				console.log(this.name + ': ' + t.name + ' started: go next.');
				self.next();
			},
			args: arguments,
			name: 'do_startThread',
			object: this
		});
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
				function: function(thread) {
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
						this.next();
					}
				},
				args: arguments,
				name: 'checkwait',
				object: this
			})
		}
	};
}