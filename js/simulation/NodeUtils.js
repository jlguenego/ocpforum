(function(sim, undefined) {
	sim.NodeUtils = {};

	sim.NodeUtils.getAddressFromAngle = function(angle, perimeter) {
		perimeter = perimeter || 360;
		var new_perimeter = parseInt('1' + new Array(41).join('0'), 16);
		var address = (angle / perimeter) * new_perimeter;
		return address.toString(16).padleft(40, '0');
	};

	sim.NodeUtils.getAngleFromAddress = function(address, perimeter) {
		perimeter = perimeter || 360;
		var address_perimeter = parseInt('1' + new Array(41).join('0'), 16);
		var angle = (parseInt(address, 16) / address_perimeter) * perimeter;
		return angle;
	};
})(sim)
