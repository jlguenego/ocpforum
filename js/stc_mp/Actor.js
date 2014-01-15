(function(sim, undefined) {
	stc.Actor = function(name) {
		var self = this;

		this.parent = null;
		this.name = name;
		this.color = stc.Utils.getColorFromString(this.name);
		this.amount = 0;
		this.nodes = [];
		this.type = 'actor';
		this.mouse = false;
	};
})(stc)
