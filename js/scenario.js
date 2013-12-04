function Scenario() {
	this.orders = [];

	this.start = function() {
		this._next();
	};

	this._next = function() {
		var order = this.orders.shift();
		if (order) {
			order.function.apply(order.object, order.args);
		} else {
			console.log('no order anymore.');
		}
	};
};