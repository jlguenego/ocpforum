(function(sim, undefined) {
	sim.Contact = function(n) {
		var self = this;

		this.name = n.name;
		this.start_address = n.start_address;
		this.ring = n.ring;
		this.node = n;

		this.getNode = function() {
			return this.node;
		};
	};
})(sim)
