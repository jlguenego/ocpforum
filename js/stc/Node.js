(function(sim, undefined) {
	stc.Node = function(name, owner) {
		var self = this;

		this.name = name;
		this.owner = owner;
		this.color = this.owner.color;
		this.type = 'node';
		this.mouse = false;
	};
})(stc)
