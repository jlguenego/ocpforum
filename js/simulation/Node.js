(function(sim, undefined) {
	sim.Node = function(n) {
		var self = this;

		this.name = n.name;
		this.image = n.image;
		this.start_address = n.start_address;
		this.parent = null;
		this.ring = n.ring;

		this.propertiesGroup = null;

		// Store all contacts including myself
		this.contacts = {};
		this.neighbors = {};

		this.objects = {};

		// Contact array sorted by address, starting at the node.
		this.sorted_ring = [];
		// For all rings gives an assoc array: address => contact
		this.rings = {};

		this._connectTo = function(thread, sponsor) {
			this.ring = sponsor.getNewRing();
			this.start_address = sponsor.getNewAddress(this.ring);
			this.addContact(this.toContact());

			// update the global view.
			this.parent.nodes[this.name] = this;
			this.parent.rings[this.ring].nodes[this.name] = this;

			var t = new Thread('connectTo');
			this.parent.repaintNodes(t);
			this.addLinks(t, sponsor);
			this.getData(t);
			thread.do_wait(t);
			thread.do_startThread(t);
			thread.next();
		}

		this.getData = function(thread) {
			thread.push({
				function: function(thread) {
					if (this.sorted_ring.length <= 1) {
						console.log(thread.name + ': ring size <= 1');
						thread.next();
						return;
					}
					var predecessor_address = this.sorted_ring[this.sorted_ring.length - 1];
					var predecessor_contact = this.rings[this.ring][predecessor_address];

					var successor_address = this.sorted_ring[1 % this.sorted_ring.length];

					var interval = {
						start_address: this.start_address,
						end_address: successor_address
					};

					// program a visual transfer of data.
					this.parent._copy(thread, predecessor_contact.name, this.name, interval);
				},
				args: arguments,
				name: 'addNode',
				object: this
			});
		};

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
			console.log(this.name + ': contacts=' + contacts.map(function(d) {return d.name;}).join(' '));
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

		this.getNewAddress = function(ring) {
			var addressList = d3.keys(this.rings[ring]);
			if (addressList.length == 0) {
				//console.log(this.name + ': first node ?');
				return sim.NodeUtils.getAddressFromAngle(10);
			}

			var angleList = addressList.map(function(d) {
				return sim.NodeUtils.getAngleFromAddress(d);
			});

			angleList.sort(function(a, b) {
				return a - b;
			});

			var perimeter = 360;
			var end = angleList[0] + perimeter;
			angleList.push(end);
			console.log(this.name + ': angleList=' + angleList.join(' '));

			var max_space = 0;
			var index = 0;
			var list = [];
			for (var i = 0; i < angleList.length - 1; i++) {
				var space = angleList[i + 1] - angleList[i];
				list.push(space);
				if (max_space < space) {
					max_space = space;
					index = i;
				}
			}
			console.log(this.name + ': intervals=' + list.join(' '));

			var angle = (angleList[index] + angleList[index + 1]) / 2;
			angle = angle % perimeter;
			return sim.NodeUtils.getAddressFromAngle(angle);
		};

		this.addLinks = function(thread, sponsor) {
			thread.push({
				function: this._addLinks,
				args: arguments,
				name: '_addLinks',
				object: this
			});
		};

		this._addLinks = function(thread, sponsor) {
			var contact_list = sponsor.serviceAccept(this.toContact());
			console.log(self.name + ': contact list=' + d3.keys(contact_list).join(' '));

			for (var name in contact_list) {
				var contact = contact_list[name];
				self.addContact(contact);
			}

			self.addNeighbors();
			self.parent._repaintNodes(thread);
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
			//console.log(this.name + ': pinging ' + contact.name);
			if (!this.parent.nodes[contact.name]) {
				this.removeNeighbor(contact.name);
				this.removeContact(contact.name);
				return false;
			}
			return true;
		};

		this.computeNeighbors = function() {
			var result = [];
			for (var name in this.contacts) {
				if (name == this.name) {
					continue;
				}
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

		this.is2NSuccessor = function(a1, a2) {
			var i = this.sorted_ring.indexOf(a1);
			var list_1 = this.sorted_ring.slice(i);
			var list_2 = this.sorted_ring.slice(0, i);
			var list = list_1.concat(list_2);

			var index = list.indexOf(a2);
			var p = Math.log(index) / Math.LN2;

			var result = (p - Math.floor(p)) < 0.001;
			return result;
		};

		this.isNeighborInsideRing = function(contact) {
			var r1 = this.is2NSuccessor(this.start_address, contact.start_address);
			var r2 = this.is2NSuccessor(contact.start_address, this.start_address);

			return r1 || r2;
		};

		this.serviceAccept = function(new_contact) {
			this.addContact(new_contact);
			this.refreshNeighbors();
			this.informNeighbors(new_contact);

			var contact_list = {};
			for (var name in self.contacts) {
				var contact = self.contacts[name];
				contact_list[name] = contact;
			}
			return contact_list;
		};

		this.informNeighbors = function(new_contact) {
			for (var name in this.neighbors) {
				var contact = this.neighbors[name];
				var node = contact.getNode();
				node.serviceAddContact(new_contact);
			}
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
						this.removeNeighbor(contact.name);
					}
				} else {
					var responsible_contact = this.getResponsibleContact(contact.ring, this.start_address);
					if (responsible_contact) {
						if (responsible_contact.name != contact.name) {
							var c = contact.getNode().getResponsibleContact(this.ring, contact.start_address);
							if (c.name != this.name) {
								this.removeNeighbor(contact.name);
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

		this.getRecoveryNodes = function(interval) {
			var result = [];
			console.log(interval);

			for (var ring in this.rings) {
				if (ring == this.ring) {
					continue;
				}

				for (var address in this.rings[ring]) {
					var contact = this.rings[ring][address];
					if (this.isInsideInterval(address, interval) && address != interval.start_address) {
						result.push(contact.name);
					}
				}
				var c = this.getResponsibleContact(ring, interval.start_address);
				result.push(c.name);
			}

			return result;
		};

		this.isInsideInterval = function(address, interval) {
			var start = sim.NodeUtils.getAngleFromAddress(interval.start_address);
			var end = sim.NodeUtils.getAngleFromAddress(interval.end_address);
			var normal = start <= end;

			var angle = sim.NodeUtils.getAngleFromAddress(address);
			if (normal) {
				if (angle >= start && angle < end){
					return true;
				}
			} else {
				if (!(angle >= end && angle < start)) {
					return true;
				}
			}
			return false;
		};

		this.getRecoveryInterval = function(thread) {
			var recovery_start_address = this.sorted_ring[1 % this.sorted_ring.length];
			var recovery_end_address = null;
			while (true) {
				console.log(this.name + ': sorted_ring=' + this.sorted_ring.join(' '));
				var recovery_end_address = this.sorted_ring[1 % this.sorted_ring.length];
				console.log(this.name + ': recovery_end_address=' + recovery_end_address);
				var c = this.rings[this.ring][recovery_end_address];
				if (this.ping(c)) {
					break;
				}
			}
			if (recovery_end_address == recovery_start_address) {
				return null;
			}
			return {
				start_address: recovery_start_address,
				end_address: recovery_end_address
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
			if (this.contacts[contact.name]) {
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
			this.refreshSortedRing();
		};

		this.serviceAddContact = function(contact) {
			if (this.contacts[contact.name]) {
				// Already in contact.
				return;
			}
			this.addContact(contact);
			// Forward info to all neighbors.
			for (var name in this.neighbors) {
				var c = this.neighbors[name];
				c.getNode().serviceAddContact(contact);
			}

			// Then refresh myself.
			this.refreshNeighbors();
		};

		this.do_serviceRemoveContact = function(thread, contactName) {
			thread.unshift({
				function: this.serviceRemoveContact,
				args: arguments,
				name: 'serviceRemoveContact',
				object: this
			});
		};

		this.serviceRemoveContact = function(thread, contactName) {
			if (!this.contacts[contactName]) {
				return;
			}

			this.removeContact(contactName);

			for (var name in this.neighbors) {
				var contact = this.neighbors[name];
				// Propagate the info.
				contact.getNode().informContactRemoved(thread, contactName);
			}

			this.refresh(thread);
		};

		this.removeContact = function(contactName) {
			if (!this.contacts[contactName]) {
				return;
			}
			this.removeNeighbor(contactName);

			var contact = this.contacts[contactName];
			var r_contacts = this.rings[contact.ring];
			delete r_contacts[contact.start_address];

			delete this.contacts[contactName];

			this.refreshSortedRing();
		};

		this.informContactRemoved = function(thread, contactName) {
			this.do_serviceRemoveContact(thread, contactName);
			this.refresh(thread);
		};

		this.refreshSortedRing = function() {
			var address_list = d3.keys(this.rings[this.ring]);
			address_list.sort();
			var i = address_list.indexOf(this.start_address);
			var list_1 = address_list.slice(i);
			var list_2 = address_list.slice(0, i);
			this.sorted_ring = list_1.concat(list_2);
			//console.log(this.name + ': sorted_ring=' + this.sorted_ring.join(' '));
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

		this.removeNeighbor = function(contactName) {
			if (!this.neighbors[contactName]) {
				return;
			}
			//console.log(this.name + 'removes neighbors ' + contact.name);
			delete this.neighbors[contactName];
			delete this.parent.links[contactName + '_' + this.name];
			delete this.parent.links[this.name + '_' + contactName];

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

		this.getRingResponsible = function(objectAddress) {
			var neighbors = jlg.findAll(d3.values(this.neighbors), function(d) {
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

			var contact = jlg.find(neighbors, function(d) {
				return (d.start_address == node_address) && (d.ring == self.ring);
			});

			return contact.getNode();
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

			var contact = jlg.find(d3.values(contacts), function(d) {
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

			var contact = jlg.find(d3.values(this.neighbors), function(d) {
				return (d.start_address == node_address) && (d.ring == ringName);
			});

			return contact;
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

		// REFRESH
		this.do_refresh = function(thread) {
			thread.unshift({
				function: this._refresh,
				args: arguments,
				name: '_refresh',
				object: this
			});
		};

		this._refresh = function(thread) {
			var interval = this.getRecoveryInterval(thread);
			console.log(interval);

			if (interval) {
				this.parent.do_retrieveInterval(thread, this.name, interval);
			}

			// for the time being, we just refresh the neighbors.
			this.refreshNeighbors();
			// and the painting.
			this.parent._repaintNodes(thread);
		};

		// RETRIEVE
		this.do_retrieve = function(thread, objectAddress) {
			thread.unshift({
				function: this._retrieve,
				args: arguments,
				name: '_retrieve',
				object: this
			});
		};

		this._retrieve = function(thread, objectAddress) {
			console.log(this.name + ': _retrieve address ' + objectAddress);
			this.do_retrieveOperation(thread, objectAddress);
			this._refresh(thread);
		};

		this.do_retrieveOperation = function(thread, objectAddress) {
			thread.unshift({
				function: this._retrieveOperation,
				args: arguments,
				name: '_retrieveOperation',
				object: this
			});
		};

		this._retrieveOperation = function(thread, objectAddress) {
			if (this.objects[objectAddress]) {
				thread.next();
				return;
			}

			var next_node = this.getRingResponsible(objectAddress);
			console.log(next_node);

			if (this == next_node) {
				// This is the responsible node.
				if (!this.objects[objectAddress]) {
					throw new Error('Object not found on ' + this.name + ': ' + objectAddress);
				}
			} else {
				this.parent.do_transfer(thread, next_node.name, this.name, objectAddress);
				thread.unshift({
					function: next_node._retrieve,
					args: [ thread, objectAddress ],
					name: '_retrieve',
					object: next_node
				});
			}
			thread.next();
		};

		// STORE
		this._store = function(thread, objectAddress, storage_method) {
			var context = {};
			if (storage_method == 'redundancy_first') {
				context = { send_to_other_rings: true };
			} else if (storage_method == 'redundancy_last') {
				context = { initial_ring: this.ring };
			}
			var t = new Thread('store');
			this.storeRec(t, objectAddress, context);
			t.waitAll();
			t.start();
			thread.do_wait(t);
			thread.next();
		};

		this.storeRec = function(thread, objectAddress, context) {
			thread.push({
				function: this._storeRec,
				args: arguments,
				name: '_storeRec',
				object: this
			});
		};

		this.do_storeRec = function(thread, objectAddress, context) {
			thread.unshift({
				function: this._storeRec,
				args: arguments,
				name: '_storeRec',
				object: this
			});
		};

		this._storeRec = function(thread, objectAddress, context) {
			console.log('_storeRec');
			this.do_storeOperation(thread, objectAddress, context);
			this.do_refresh(thread);
			console.log(thread.orders.slice());
			thread.next();
		};

		this.do_storeOperation = function(thread, objectAddress, context) {
			thread.unshift({
				function: this._storeOperation,
				args: arguments,
				name: '_storeOperation',
				object: this
			});
		};

		this._storeOperation = function(thread, objectAddress, context) {
			if (context.send_to_other_rings == true) {
				delete context.send_to_other_rings;
				thread.waiting_list = this.sendToOtherRings(objectAddress);
			}

			console.log('objectAddress=' + objectAddress);
			var next_node = this.getRingResponsible(objectAddress);

			if (this.name == next_node.name) {
				// This is the responsible node.
				if (context.initial_ring == this.ring) {
					thread.waiting_list = this.sendToOtherRings(objectAddress);
				}
				console.log(thread.name + ': responsible node=' + next_node.name);
				console.log(thread.name + ': _storeOperation responsible node: next');
				thread.next();
			} else {
				next_node.do_storeRec(thread, objectAddress, context);
				this.parent._transfer(thread, this.name, next_node.name, objectAddress);
			}
		};

		this.sendToOtherRings = function(objectAddress) {
			var list = [];
			for (var ringName in this.rings) {
				if (ringName == this.ring) {
					continue;
				}

				var ringNode = this.getResponsibleForRing(ringName, objectAddress).getNode();;

				if (!ringNode) {
					continue;
				}

				var tname = objectAddress + '_' + ringName;
				var new_thread = new Thread(tname);
				list.push(new_thread);
				ringNode.do_storeRec(new_thread, objectAddress, {});
				this.parent.do_transfer(new_thread, this.name, ringNode.name, objectAddress);
				new_thread.start();
			}
			return list;
		};
	};
})(sim)
