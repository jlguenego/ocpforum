(function(sim, undefined) {
	stc.Actor = function(name, type) {
		var self = this;

		this.parent = null;
		this.name = name;
		this.color = stc.Utils.getColorFromString(this.name);
		this.amount = 0;
		this.mined_amount = 0;
		this.price_earned_amount = 0;
		this.nodes = [];
		this.type = type;
		this.mouse = false;

		this.behave = function(thread) {
			if (this.type == 'provider') {
				this.behave_p(thread);
			}
			if (this.type == 'consumer') {
				this.behave_c(thread);
			}
		};

		this.behave_p = function(thread) {
			var amount_percent = Math.randomize(10, 100);
			var rate_coef = Math.randomize(0.5, 1.5);
			this.parent.publishOffer(thread, this, amount_percent, rate_coef);
		};

		this.behave_c = function(thread) {
			var gb_needed = Math.randomize(10, 100);
			var rate_coef = Math.randomize(0.5, 1.5);
			this.parent.publishDemand(thread, this, gb_needed, rate_coef);
		};
	};
})(stc)
