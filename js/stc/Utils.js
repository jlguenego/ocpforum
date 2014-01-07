(function(sim, undefined) {
	stc.Utils = {};

	stc.Utils.getColorFromString = function(str) {
		var hash = CryptoJS.SHA1(str).toString();
		var perimeter = parseInt('1' + new Array(41).join('0'), 16);
		var hue = (parseInt(hash, 16) / perimeter) * 360;
		return 'hsl(' + hue + ', 100%, 50%)';
	};

	stc.Utils.getActorScale = function(sys) {
		var result = 1.0;
		var actor_nbr = sys.actors.length;

		result = 20 / (actor_nbr + 20);

		return result;
	};
})(stc)
