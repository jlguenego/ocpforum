function Thread(name) {
	var self = this;
	this.name = name;
	this.orders = [];

	this.isFinished = false;

	this.debug = null;
	this.waiting_list = [];

	this.push = function(order) {
		//console.log(this.name + ': Pushing order ' + order.name);
		this.orders.push(order);
	};

	this.unshift = function(order) {
		console.log(this.name + ': Unshifting order ' + order.name);
		this.orders.unshift(order);
	};

	this.setDebug = function(selector) {
		this.debug = selector;
		$(this.debug).click(function() {
			console.log('debug next.');
			self._next();
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

	this.finish = function() {
		this.push({
			function: function(thread) {
				console.log(thread.name + ': finished');
				this.isFinished = true;
				// no thread.next();
			},
			args: [ this ],
			name: 'finished',
			object: this
		});
		this.push({
			function: function(thread) {
				console.log(thread.name + ': You do too much thread.next(); Check your code...');
				throw new Error('Too much thread.next()... Check the code.');
				// no thread.next();
			},
			args: [ this ],
			name: 'error->overflow !',
			object: this
		});

	};

	this.startThread = function(t) {
		this.push({
			function: function(t) {
				t.start();
				console.log(this.name + ': ' + t.name + ' started: go next.');
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

	this.waitAll = function() {
		this.push({
			function: function() {
				var waiting_list = this.waiting_list.map(jlg.accessor('name')).join(' ');
				console.log(this.name + ': waiting_list = ' + waiting_list);
				this._wait.apply(this, this.waiting_list);
			},
			args: [ ],
			name: 'waitAll',
			object: this
		});
	};

	this.do_waitAll = function() {
		this.unshift({
			function: function() {
				var waiting_list = this.waiting_list.map(jlg.accessor('name')).join(' ');
				console.log(this.name + ': waiting_list = ' + waiting_list);
				this._wait.apply(this, this.waiting_list);
			},
			args: [ ],
			name: 'waitAll',
			object: this
		});
	};

	this.wait = function() {
		var waiting_list = Array.prototype.slice.call(arguments);
		this.push({
			function: function() {
				var str = waiting_list.map(jlg.accessor('name')).join(' ');
				console.log(this.name + ': start to wait for : ' + str);
				this._wait.apply(this, waiting_list);
			},
			args: [],
			name: 'wait',
			object: this
		});
	};

	this.do_wait = function() {
		var waiting_list = Array.prototype.slice.call(arguments);
		this.unshift({
			function: function() {
				var str = waiting_list.map(jlg.accessor('name')).join(' ');
				console.log(this.name + ': start to wait for : ' + str);
				this._wait.apply(this, waiting_list);
			},
			args: [],
			name: 'do_wait',
			object: this
		});
	};

	this._wait = function() {
		var main_thread = this;
		var counter = 0;
		var thread_children_list = arguments;
		for (var i = 0; i < thread_children_list.length; i++) {
			var child_thread = thread_children_list[i];
			if (child_thread.isFinished) {
				console.log(main_thread.name + ': Child thread ' + child_thread.name + ' is already finished.');
				continue;
			}
			console.log(main_thread.name + ': Child thread ' + child_thread.name + ' will wait me.');
			counter++;
			child_thread.push({
				function: function(main_thread) {
					console.log(thread_children_list);
					var child_thread = this;
					child_thread.isFinished = true;
					var allFinished = true;
					for (var i = 0; i < thread_children_list.length; i++) {
						var t = thread_children_list[i];
						if (t.isFinished == false) {
							allFinished = false;
							break;
						}
					}

					if (allFinished) {
						console.log(main_thread.name + ': Wait released.');
						main_thread.next();
					}
				},
				args: [ main_thread ],
				name: 'checkwait',
				object: child_thread
			});
			console.log(child_thread.name + ': order_list: ' + child_thread.orders.map(function(d) { return d.name}).join(', '));
		}
		if (counter == 0) {
			// there is no thread to wait for.
			main_thread.next();
		}
	};

	this.sleep = function(duration) {
		var thread = this;
		this.push({
			function: function(duration) {
				console.log(thread.name + ': Start sleeping for ' + duration + 'ms');
				setTimeout(function() {
					console.log(thread.name + ': Wake up after ' + duration + 'ms');
					thread.next();
				}, duration);
			},
			args: arguments,
			name: 'sleep',
			object: this
		});
	};

	this.execute = function(f) {
		this.push({
			function: function() {
				f();
				this.next();
			},
			args: arguments,
			name: 'execute',
			object: this
		});
	};
}