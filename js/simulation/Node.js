(function(sim, undefined) {
	sim.Node = function(n) {
		var self = this;

		this.name = n.name;
		this.image = n.image;
		this.start_address = n.start_address;
		this.parent = null;
		this.ring = n.ring;

		this.propertiesGroup = null;

		this.contacts = {};
		this.neighbors = {};
		this.rings = {};

		this.objects = {};

		this.connectTo = function(sponsor) {
			this.ring = sponsor.getNewRing();
			this.start_address = sponsor.getNewAddress(this.ring);

			// update the global view.
			this.parent.nodes[this.name] = this;
			this.parent.rings[this.ring].nodes[this.name] = this;

			this.addLinks(sponsor);
		}

		this.getNewRing = function() {
			//console.log(this.name + ': get new ring: refresh neighbors');
			this.refreshNeighbors();

			var rings_names = d3.keys(this.parent.rings);

			var rings = {};
			for (var i = 0; i < rings_names.length; i++) {
				var name = rings_names[i];
				rings[name] = 0;
			}

			var contacts = d3.values(this.contacts);
			contacts.push(this.toContact());
			for (var i = 0; i < contacts.length; i++) {
				var contact = contacts[i];
				rings[contact.ring]++;
			}

			var min_value = null;
			var ring_name = null;
			for (var name in rings) {
				if (min_value == null || rings[name] < min_value) {
					min_value = rings[name];
					ring_name = name;
				}
			}

			return ring_name;
		};

		this.getAddressFromAngle = function(angle, perimeter) {
			perimeter = perimeter || 360;
			var new_perimeter = parseInt('1' + new Array(41).join('0'), 16);
			var address = (angle / perimeter) * new_perimeter;
			return address.toString(16).padleft(40, '0');
		}

		this.getNewAddress = function(ring) {
			var contactList = d3.values(this.contacts).findAll(function(d) {
				return d.ring == ring;
			});

			var addressList = contactList.map(function(d) { return d.start_address; });
			if (ring == this.ring) {
				addressList.push(this.start_address);
			}
			addressList = addressList.map(function(d) {
				return parseInt(d, 16);
			});

			if (addressList.length == 0) {
				//console.log(this.name + ': first node ?');
				return this.getAddressFromAngle(10);
			}

			addressList.sort(function(a, b) {
				return a - b;
			})

			var perimeter = parseInt('1' + (new Array(41).join('0')), 16);
			var end = addressList[0] + perimeter;
			addressList.push(end);

			var max_space = 0;
			var index = 0;
			var list = [];
			for (var i = 0; i < addressList.length - 1; i++) {
				var space = addressList[i + 1] - addressList[i];
				list.push(space);
				if (max_space < space) {
					max_space = space;
					index = i;
				}
			}

			var address = (addressList[index] + addressList[index + 1]) / 2;
			address = address % perimeter;
			return address.toString(16).padleft(40, '0');
		};

		this.addLinks = function(sponsor) {
			var contact_list = sponsor.accept(this.toContact());
			console.log(this.name + ': contact list=' + d3.keys(contact_list).join(' '));

			for (var name in contact_list) {
				var contact = contact_list[name];
				this.addContact(contact);
			}

			this.addNeighbors();
		};

		this.addNeighbors = function() {
			while (true) {
				var neighbors = this.computeNeighbors();
				var okForAll = true;
				for (var i = 0; i < neighbors.length; i++) {
					var contact = neighbors[i];
					if (this.ping(contact)) {
						this.addNeighbor(contact);
					} else {
						okForAll = false;
						break;
					}
				}
				if (okForAll) {
					break;
				}
			}
		};

		this.ping = function(contact) {
			if (!this.parent.nodes[contact.name]) {
				this.removeNeighbor(contact);
				this.removeContact(contact.name);
				return false;
			}
			return true;
		};

		this.computeNeighbors = function() {
			var result = [];
			for (var name in this.contacts) {
				var contact = this.contacts[name];
				var isNeighbor = false;

				if (contact.ring == this.ring) {
					isNeighbor = this.isNeighborInsideRing(contact);
				} else {
					var responsible_contact = this.getResponsibleContact(contact.ring, this.start_address);
					if (responsible_contact.name == contact.name) {
						isNeighbor = true;
					}
				}

				if (isNeighbor) {
					result.push(contact);
				}
			}
			return result;
		};

		this.is2NSuccessor = function(ring, a1, a2) {
			var i = ring.indexOf(a1);
			var list_1 = ring.slice(i);
			var list_2 = ring.slice(0, i);
			var list = list_1.concat(list_2);

			var index = list.indexOf(a2);
			var p = Math.log(index) / Math.LN2;

			var result = (p - Math.floor(p)) < 0.001;
			return result;
		};

		this.isNeighborInsideRing = function(contact) {
			var ring = d3.keys(this.rings[contact.ring]);
			ring.push(this.start_address);
			ring.sort();
			//console.log(this.name + ': ring=');
			//console.log(ring);

			var r1 = this.is2NSuccessor(ring, this.start_address, contact.start_address);
			var r2 = this.is2NSuccessor(ring, contact.start_address, this.start_address);

			return r1 || r2;
		};

		this.accept = function(new_contact) {
			var result = {};
			result[this.name] = this.toContact();
			this.addContact(new_contact);
			//console.log(this.name + ': refresh neighbors myself');
			this.refreshNeighbors();
			for (var name in this.neighbors) {
				var contact = this.neighbors[name];
				var node = contact.getNode();
				node.addContact(new_contact);
				//console.log(this.name + ': refresh neighbors of ' + node.name);
				node.refreshNeighbors();
			}

			for (var name in this.contacts) {
				var contact = this.contacts[name];
				result[name] = contact;
			}
			return result;
		};

		this.refreshNeighbors = function() {
			//console.log(this.name + ': refresh neighbors');
			this.addNeighbors();

			for (var name in this.neighbors) {
				var contact = this.neighbors[name];
				this.ping(contact);
				if (contact.ring == this.ring) {
					if (!this.isNeighborInsideRing(contact)) {
						//console.log(this.name + ': is not neighbor with ' + contact.name);
						this.removeNeighbor(contact);
					}
				} else {
					var responsible_contact = this.getResponsibleContact(contact.ring, this.start_address);
					if (responsible_contact) {
						if (responsible_contact.name != contact.name) {
							var c = contact.getNode().getResponsibleContact(this.ring, contact.start_address);
							if (c.name != this.name) {
								this.removeNeighbor(contact);
							}
						}
					}
				}
			}
			// add neighbors from unconnected rings.
			//console.log(this.name + ': maintaining neighbors on other rings.');
			for (var ring in this.parent.rings) {
				if (ring == this.ring) {
					continue;
				}
				//console.log(this.name + ': handling ring: ' + ring);
				if (!this.isNeighborsForRing(ring)) {
					this.createNeighborForRing(ring);
				}
			}
			//console.log(this.name + ': refreshed neighbor list=' + d3.keys(this.neighbors).join(' '));
			//console.log(this.name + ': end refresh neighbors');
		};

		this.isSuccessorDown = function() {
			var contact = this.getNeighbor(1);
			var b = this.ping(contact);
			console.log(this.name + ': ping ' + contact.name + '? ' + b);
			return !b;
		};

		this.getNeighbor = function(rank) {
			var contacts = d3.values(this.rings[this.ring]);
			contacts.push(this.toContact());
			var list = contacts.map(function(d) { return d.start_address; });
			list.sort();

			var i = list.indexOf(this.start_address);
			var list_1 = list.slice(i);
			var list_2 = list.slice(0, i);
			list = list_1.concat(list_2);

			var index = rank % contacts.length;
			var address = list[index];
			var contact = contacts.find(function(d) {
				return d.start_address == address;
			});
			console.log(this.name + ': getNeighbor(' + rank + ')=' + contact.name);
			return contact;
		};

		this.retrieveSuccessorInterval = function() {
			return {
				start: this.getNeighbor(1).start_address,
				stop: this.getNeighbor(2).start_address
			};
		};

		this.isNeighborsForRing = function(ring) {
			for (var name in this.neighbors) {
				var n = this.neighbors[name];
				if (n.ring == ring) {
					return true;
				}
			}
			return false;
		};

		this.createNeighborForRing = function(ring) {
			while (true) {
				//console.log(this.name + ': entering loop');
				var contact = this.getResponsibleContact(ring, this.start_address);
				if (!contact) {
					//console.log(this.name + ': I have no contact for ring ' + ring);
					return;
				}
				//console.log(this.name + ': contact = ' + contact.name);
				if (this.ping(contact)) {
					//console.log(this.name + ': ping ok');
					this.addNeighbor(contact);
					break;
				} else {
					//console.log(this.name + ': cannot ping ' + contact.name);
				}
			}
		};

		this.addContact = function(contact) {
			if (this.contacts[contact.name] || this.name == contact.name) {
				// Already in contact.
				return;
			}
			//console.log(this.name + ': add contact ' + contact.name);
			this.contacts[contact.name] = contact;
			//console.log(this.name + ': contact list=' + d3.keys(this.contacts).join(' '));

			if (!this.rings[contact.ring]) {
				this.rings[contact.ring] = {};
			}
			this.rings[contact.ring][contact.start_address] = contact;
			// Forward info to all neighbors.
			for (var name in this.neighbors) {
				var c = this.neighbors[name];
				c.getNode().addContact(contact);
			}
			// Then refresh myself.
			this.refreshNeighbors();
		};

		this.removeContact = function(contactName) {
			if (!this.contacts[contactName]) {
				return;
			}
			var contact = this.contacts[contactName];
			var r_contacts = this.rings[contact.ring];
			delete r_contacts[contact.start_address];

			delete this.contacts[contactName];
			delete this.neighbors[contactName];

			for (var name in this.neighbors) {
				var contact = this.neighbors[name];
				contact.getNode().removeContact(contactName);
			}
		};

		this.toContact = function() {
			return new sim.Contact(this);
		};

		this.addNeighbor = function(contact) {
			this.neighbors[contact.name] = contact;
			contact.getNode().neighbors[this.name] = this.toContact();

			this.parent.links[contact.name + '_' + this.name] = {
				source: contact.getNode(),
				target: this,
				id: contact.name + '_' + this.name
			};
			this.parent.links[this.name + '_' + contact.name] = {
				source: this,
				target: contact.getNode(),
				id: this.name + '_' + contact.name
			};

			this.parent.report({ add_link: 1 });
		};

		this.removeNeighbor = function(contact) {
			if (!this.neighbors[contact.name]) {
				return;
			}
			//console.log(this.name + 'removes neighbors ' + contact.name);
			delete this.neighbors[contact.name];
			delete this.parent.links[contact.name + '_' + this.name];
			delete this.parent.links[this.name + '_' + contact.name];

			this.parent.report({ add_link: -1 });
		};

		this.getAbsoluteCoord = function() {
			var ring = this.parent.rings[this.ring];
			var cx = this.parent.ring_cx(ring);
			var cy = this.parent.ring_cy(ring);
			var r = this.parent.ring_r(ring);

			var angle = (parseInt(this.start_address.substr(0, 4), 16) / 0xffff) * 2 * Math.PI;
			var x = cx + r * Math.cos(angle);
			var y = cy - r * Math.sin(angle);
			return {
				x: x,
				y: y
			};
		};

		this.getAbsoluteCoordSVG = function() {
			var ring = this.parent.rings[this.ring];
			var cx = this.parent.ring_cx(ring);
			var cy = this.parent.ring_cy(ring);
			var r = this.parent.ring_r(ring);

			var angle = (parseInt(this.start_address.substr(0, 4), 16) / 0xffff) * 2 * Math.PI;
			var x = cx + r * Math.cos(angle);
			var y = cy - r * Math.sin(angle);

			var result = {
				x: x * this.parent.scale,
				y: (y * this.parent.scale) + (this.parent.svgbox.y / 2)
			};
			return result;
		};

		this.getResponsible = function(objectAddress) {
			var neighbors = d3.values(this.neighbors).findAll(function(d) {
				return self.ring == d.ring;
			});
			var ring = neighbors.map(function(d) { return d.start_address; });

			ring.push(this.start_address);
			ring.push(objectAddress);

			ring.sort();
			var index = ring.indexOf(objectAddress);
			if (index == 0) {
				index = ring.length;
			}
			var node_address = ring[index - 1];

			if (node_address == this.start_address) {
				// Object is stored.
				return this;
			}

			var contact = neighbors.find(function(d) {
				return d.start_address == node_address;
			});

			return contact;
		};

		this.getResponsibleContact = function(ringName, address) {
			var contacts = this.rings[ringName];
			var addressList = [];
			for (var a in contacts) {
				if (a == address) {
					return contacts[a];
				}
				addressList.push(a);
			}

			addressList.push(address);

			addressList.sort();
			var index = addressList.indexOf(address);
			if (index == 0) {
				index = addressList.length;
			}
			var contact_address = addressList[index - 1];

			var contact = d3.values(contacts).find(function(d) {
				return d.start_address == contact_address;
			});

			return contact;
		};

		this.getResponsibleForRing = function(ringName, objectAddress) {
			var ring = [];
			for (var nodeName in this.neighbors) {
				var n = this.neighbors[nodeName];
				if (n.ring != ringName) {
					continue;
				}
				if (n.start_address == objectAddress) {
					return n;
				}
				ring.push(n.start_address);
			}

			ring.push(objectAddress);

			ring.sort();
			var index = ring.indexOf(objectAddress);
			if (index == 0) {
				index = ring.length;
			}
			var node_address = ring[index - 1];

			var node = d3.values(this.neighbors).find(function(d) {
				return (d.start_address == node_address) && (d.ring == ringName);
			});

			return node;
		};

		this.showProperties = function() {
			var svg = this.parent.svg;
			var x = this.parent.svgbox.x - 150;
			var y = 25;
			this.propertiesGroup = svg.append('g')
				.classed('node_properties', true)
				.attr('transform', 'translate(' + x + ', ' + y + ')');

			var g = this.propertiesGroup.selectAll('use.object').data(d3.values(this.objects));
			g.exit().remove();
			g.enter().append('rect')
				.classed('object', true)
				.attr('width', 15)
				.attr('height', 15)
				.attr('x', function(d, i) { return i % 5 * 30})
				.attr('y', function(d, i) { return Math.floor(i / 5) * 30})
				.attr('fill', function(d) {
					return self.parent.getColorFromAddress(d.address);
				});
		};

		this.hideProperties = function() {
			this.propertiesGroup.remove();
		};
	};
})(sim)
