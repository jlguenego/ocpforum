/*!
 * jQuery UI Menu
 *
 *
 * Depends:
 *   ocp.core.js
 *   jquery.ui.widget.js
 */

"use strict";

(function( $, undefined ) {

$.widget( "ui.ocp_content_table", {
	version: "0.0.1",
	options: {
	},

	list: null,

	_create: function() {
		console.log(window.location);
		this.list = $('<ul/>').addClass('widget_content_table').appendTo(this.element);

		var children = $('body').find('*');
		var sublist = $('<ul/>');
		for (var i = 0; i < children.length; i++) {
			var child = children.eq(i);
			if (!child.is('h2') && !child.is('h3')) {
				continue;
			}

			var link = child.find('a');
			if (!link) {
				continue;
			}

			if (!link.attr('name')) {
				continue;
			}

			var url = window.location.href;
			if (url.indexOf('#') != -1) {
				url = url.replace(/^(.*)#.*$/, '$1');
			}

			var a = $('<a/>').attr('href', url + '#' + link.attr('name')).html(link.html());

			var li = $('<li/>').append(a);

			if (child.is('h2')) {
				if (sublist.find('li').length > 0) {
					this.list.append(sublist);
					sublist = $('<ul/>');
				}
				this.list.append(li);
			} else {
				sublist.append(li);
			}
		}
		return this;
	},

	_destroy: function() {
	}
});

})( jQuery );