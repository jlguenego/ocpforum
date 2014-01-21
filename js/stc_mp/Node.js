(function(sim, undefined) {
	stc.Node = function(owner) {
		var self = this;

		this.name = null;
		this.owner = owner;
		this.color = this.owner.color;
		this.type = 'node';
		this.mouse = false;
	};
})(stc)
