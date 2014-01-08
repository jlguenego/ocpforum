(function(sim, undefined) {
	stc.Node = function(name, owner) {
		var self = this;

		this.name = name;
		this.owner = owner;
		this.color = this.owner.color;
		this.type = 'node';

		this.showLinks = function() {
			var g = this.owner.parent.group;
			var links = g.selectAll('path[data-target=' + this.name + ']');
			links.style('opacity', 1);
		};

		this.hideLinks = function() {
			var links = this.owner.parent.links.selectAll('path[data-target=' + this.name + ']');
			links.style('opacity', 0);
		};
	};
})(stc)
