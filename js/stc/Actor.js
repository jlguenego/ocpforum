(function(sim, undefined) {
	stc.Actor = function(name) {
		var self = this;

		this.name = name;
		this.color = stc.Utils.getColorFromString(this.name);
		this.parent = null;

		this.showLinks = function() {
			var g = this.parent.group;
			var links = g.selectAll('path[data-source=' + this.name + ']');
			links.style('opacity', 1);
		};

		this.hideLinks = function() {
			var links = this.parent.links.selectAll('path[data-source=' + this.name + ']');
			links.style('opacity', 0);
		};
	};
})(stc)
