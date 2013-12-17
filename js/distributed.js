function Simulation() {
};

var sim = new Simulation();

(function(sim, undefined) {
	sim.MultiRingDS = function(thread, svg) {
		var self = this;

		this.thread = thread;
		this.svg = svg;
		this.svgbox = {
			x: svg.attr('width'),
			y: svg.attr('height')
		};
		this.defs = this.svg.append('defs');
		this.group = this.svg.insert('g', ':first-child').classed('main', true)
			.attr('transform', 'translate(0, ' + (this.svgbox.y / 2) + ')');
		this.links_g = this.group.insert('g', ':first-child').classed('links', true);
		this.reportElem = null;

		this.options = {
			duration: {
				refreshRing: 500,
				addNode: 100,
				addLink: 100,
				addObject: 100,
				doTransfer: 500,
				transform: 500
			},
			ring: {
				radius: 300,
				node: {
					scale: 2
				}
			},
			storage_method: 'redundancy_first'
		};

		this.rings = {};
		this.nodes = {};
		this.links = {};
		this.objects = {};
		this.locator = {};

		this.scale = 1;

		this.ring_cx = function(d) {
			var width = self.options.ring.radius * 2 + 200;
			return width * d.index + width / 2;
		};
		this.ring_cy = function(d) {
			return 0;
		};
		this.ring_r = function(d) {
			return self.options.ring.radius;
		};

		this.addRing = function(name) {
			this.thread.push({
				function: this._addRing,
				args: arguments,
				name: 'addRing',
				object: this
			});
		};

		this._addRing = function(name, i) {
			var thread = this.thread.getThread(arguments);

			this.rings[name] = {
				name: name,
				index: i,
				nodes: {}
			};
			this.refreshRings(thread);
		};

		this.refreshMain = function(thread) {
			var bbox = this.group.node().getBBox();
			if (bbox.width == 0) {
				return;
			}
			var scale = this.scale;
			var box_width = this.svgbox.x * 0.9;
			var box_height = this.svgbox.y * 0.9;

			if (bbox.width > box_width) {
				scale = (box_width / bbox.width);
			}
			if (bbox.height > box_height) {
				scale = Math.min(box_height / bbox.height, box_width / bbox.width);
			}
			this.scale = scale;
			var y = this.svgbox.y / 2;
			this.group.transition()
				.duration(this.options.duration.refreshRing)
				.attr('transform', 'translate(0, ' + y + ') scale(' + this.scale + ')')
				.each('end', function() {
					thread._next();
				});
		};

		this.refreshRings = function(thread) {
			var dataset = d3.values(this.rings);

			var ring_g = this.group.selectAll('g.ring').data(dataset);
			ring_g.exit().remove();

			var new_ring_g = ring_g.enter().append('g')
				.classed('ring', true);
			new_ring_g.append('circle')
					.attr('r', 0);

			if (dataset.length == 0) {
				return;
			}
			var doNext = true;

			ring_g.select('circle').attr('r', this.ring_r);

			ring_g.transition()
				.duration(this.options.duration.refreshRing)
				.attr('transform', function(d) {
					return 'translate(' + self.ring_cx(d) + ', ' + self.ring_cy(d) + ')';
				})
				.each('end', function(d) {
					if (doNext) {
						self.refreshMain(thread);
						doNext = false;
					}
				});


		};

		this.addFirstNode = function(node) {
			node.parent = this;
			this.thread.push({
				function: this._addFirstNode,
				args: arguments,
				name: 'addFirstNode',
				object: this
			});
		};

		this._addFirstNode = function(node) {
			var thread = this.thread.getThread(arguments);

			node.start_address = new Array(41).join('0');
			node.ring = d3.values(this.rings).find(function(d) { return d.index == 0; }).name;

			this.nodes[node.name] = node;
			this.rings[node.ring].nodes[node.name] = node;

			this.refreshNodes(thread);
		};

		this.addNode = function(node) {
			node.parent = this;
			this.thread.push({
				function: this._addNode,
				args: arguments,
				name: 'addNode',
				object: this
			});
		};

		this._addNode = function(node, sponsorName) {
			var thread = this.thread.getThread(arguments);

			var sponsor = this.nodes[sponsorName];
			node.ring = sponsor.getNewRing();
			node.start_address = sponsor.getNewAddress(node.ring);

			this.nodes[node.name] = node;
			this.rings[node.ring].nodes[node.name] = node;

			node.addLinks(sponsor);

			this.refreshNodes(thread);
		};

		this.refreshNodes = function(thread) {
			var dataset = d3.values(this.rings);
			var ring_g = this.svg.selectAll('g.ring').data(dataset);

			var node = ring_g.selectAll('g.node')
				.data(function(d, i) { return d3.values(d.nodes); });
			node.exit().remove();

			var new_g = node.enter().append('g')
				.classed('node', true)
				.style('opacity', 0);

			var text = new_g.append('text')
				.attr('x', 25)
				.style('opacity', 0);
			text.append('tspan')
				.text(function(d) { return d.name; });

			new_g.on('mouseover', function(d) {
					d.showProperties();
					d3.select(this).select('text')
						.transition()
							.duration(200)
							.style('opacity', 1);
				})
				.on('mouseout', function(d) {
					d.hideProperties();
					d3.select(this).select('text')
						.transition()
							.duration(200)
							.style('opacity', 0);
				});

			new_g.append('image')
				.attr('xlink:href', function(d) { return d.image; })
				.attr('transform', 'translate(-25, -25)')
				.attr('width', 50)
				.attr('height', 50);

			new_g.transition()
				.duration(this.options.duration.addNode)
				.style('opacity', 1)
				.each('end', function() {
					self.refreshLinks(thread);
					console.log(self.nodes);
				});

			node.attr('transform', function(d) {
				// 0, 0: center of the ring.
				var ring = self.rings[d.ring];
				var r = self.ring_r(ring);
				var angle = (parseInt(d.start_address.substr(0, 4), 16) / 0xffff) * 2 * Math.PI;
				var x = r * Math.cos(angle);
				var y = - r * Math.sin(angle);
				return 'translate(' + x + ', ' + y + ') scale(' + self.options.ring.node.scale + ')';
			});
		};

		this.getNodeResponsibleForRing = function(ringName, address) {
			var nodes = this.rings[ringName].nodes;
			var addressList = [];
			for (var nodeName in nodes) {
				var n = nodes[nodeName];
				if (n.start_address == address) {
					return n;
				}
				addressList.push(n.start_address);
			}

			addressList.push(address);

			addressList.sort();
			var index = addressList.indexOf(address);
			if (index == 0) {
				index = addressList.length;
			}
			var node_address = addressList[index - 1];

			var node = d3.values(nodes).find(function(d) {
				return d.start_address == node_address;
			});

			return node;
		};

		this.refreshLinks = function(thread) {
			var doNext = true;
			var dataset = d3.values(this.links);

			var path = this.links_g.selectAll('path').data(dataset);
			path.exit().remove();

			var new_path = path.enter().append('path');
			path.attr('id', function(d) { return d.id; })
				.attr('d', function(d) {
					var source_coord = d.source.getAbsoluteCoord();
					var target_coord = d.target.getAbsoluteCoord();
					var bbox = self.group.node().getBBox();

					var p1 = {
						x: ((bbox.width / 2) + source_coord.x) / 2,
						y: (source_coord.y) / 2
					};
					var p2 = {
						x: ((bbox.width / 2) + target_coord.x) / 2,
						y: (target_coord.y) / 2
					};

					if (d.source.ring == d.target.ring) {
						var ring = self.rings[d.source.ring];
						var cx = self.ring_cx(ring);
						var cy = self.ring_cy(ring);

						p1 = {
							x: (cx + source_coord.x) / 2,
							y: (cy + source_coord.y) / 2
						};
						p2 = {
							x: (cx + target_coord.x) / 2,
							y: (cy + target_coord.y) / 2
						};
					}
					return 'M' + source_coord.x + ',' + source_coord.y
						+ ' C' + p1.x + ',' + p1.y + ' ' + p2.x + ',' + p2.y
						+ ' ' + target_coord.x + ',' + target_coord.y;
				});

			if (new_path.empty()) {
				thread._next();
			}
			new_path.attr('stroke-dasharray', function(d) {
					var my_path = d3.select('#' + d.id).node();
					var length = my_path.getTotalLength();
					return length + ' ' + length;
				})
				.attr('stroke-dashoffset', function(d) {
					var my_path = d3.select('#' + d.id).node();
					var length = my_path.getTotalLength();
					return length;
				})
				.transition()
					.duration(this.options.duration.addLink)
					.attr('stroke-dashoffset', 0)
					.each('end', function(d, i) {
						if (doNext) {
							doNext = false;
							thread._next();
						}
					});
		};

		this.addObject = function(nodeName, name, source) {
			this.thread.push({
				function: this._addObject,
				args: [ nodeName, name, source, undefined ],
				name: 'addObject',
				object: this
			});
		};

		this._addObject = function(nodeName, name, source, duration) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			var obj = {
				name: name,
				source: source
			};
			node.objects[obj.name] = obj;
			this.objects[obj.name] = obj;

			this.refreshObjects(thread, duration);
		};

		this.refreshObjects = function(thread, duration) {
			if (duration === undefined) {
				duration = this.options.duration.addObject;
			}

			var symbols = this.defs.selectAll('symbol').data(d3.values(this.objects));
			symbols.exit().remove();
			symbols.enter().append('symbol')
				.attr('id', function(d) {
					return d.name;
				})
				.append('image')
					.attr('xlink:href', function(d) { return d.source; })
					.attr('width', 25)
					.attr('height', 25);

			var nodes = this.group.selectAll('g.node');
			var objects = nodes.selectAll('use.object').data(function(d) { return d3.values(d.objects); });

			objects.exit().remove();
			var new_objects = objects.enter();
			if (new_objects.empty()) {
				thread._next();
			}
			new_objects.append('use')
				.classed('object', true)
				.attr('xlink:href', function(d) { return '#' + d.name; })
				.attr('x', 0)
				.attr('y', 0)
				.style('opacity', 0)
				.transition()
					.duration(duration)
					.style('opacity', 1)
					.each('end', function() {
						thread._next();
					});

		};

		this.store = function(nodeName, objectName) {
			this.thread.push({
				function: this._store,
				args: arguments,
				name: 'store',
				object: this
			});
		};

		this._store = function(nodeName, objectName) {
			var thread = this.thread.getThread(arguments);

			if (this.options.storage_method == 'redundancy_first') {
				this._storeRF(thread, nodeName, objectName);
			} else if (this.options.storage_method == 'redundancy_last') {
				this._storeRL(thread, nodeName, objectName);
			}
		};

		this._storeRF = function(nodeName, objectName) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			node.store(thread, objectName);

			this.sendToOtherRings(thread, node, objectName);

		};

		this._storeRL = function(nodeName, objectName) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			node.store(thread, objectName, { initial_ring: node.ring });
		};

		this.sendToOtherRings = function(thread, node, objectName) {
			for (var ringName in this.rings) {
				if (ringName == node.ring) {
					continue;
				}

				var object_address = CryptoJS.SHA1(CryptoJS.SHA1(objectName)).toString();
				var ringNode = node.getResponsibleForRing(ringName, object_address);

				if (!ringNode) {
					continue;
				}

				var tname = objectName + '_' + ringName;
				var new_thread = new Thread(tname, thread);
				this.doTransfer(new_thread, node.name, ringNode.name, objectName);
				new_thread.push({
					function: this._storeRec,
					args: [ ringNode.name, objectName, {} ],
					name: '_storeRec',
					object: this
				});
				new_thread.start();
			}
		};

		this._storeRec = function(nodeName, objectName, context) {
			var thread = this.thread.getThread(arguments);
			var node = this.nodes[nodeName];
			node.store(thread, objectName, context);
		};

		this.retrieve = function(nodeName, objectName) {
			this.thread.push({
				function: this._retrieve,
				args: arguments,
				name: 'retrieve',
				object: this
			});
		};

		this._retrieve = function(nodeName, objectName) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			node.retrieve(thread, objectName, { initial: true });
		};

		this.doTransfer = function(thread, sourceName, targetName, objectName) {
			thread.unshift({
				function: this._doTransfer,
				args: [ sourceName, targetName, objectName ],
				name: 'doTransfer',
				object: this
			});
		};

		this._doTransfer = function(sourceName, targetName, objectName) {
			var thread = this.thread.getThread(arguments);
			var source = this.nodes[sourceName];
			var target = this.nodes[targetName];
			var transfer = {
				source: source,
				target: target,
				object: this.objects[objectName]
			};

			this.performTransfer(thread, transfer);
		};

		this.performTransfer = function(thread, transfer) {
			var duration = this.options.duration.doTransfer;

			var pathNode = d3.select('#' + transfer.source.name + '_' + transfer.target.name).node();
			var pathLength = pathNode.getTotalLength();
			var g_obj = this.group.append('g')
				.classed('transfer', true)
				.attr('transform', 'translate(-12, -12)');


			g_obj.append('use')
				.attr('transform', function(d) {
					var p = pathNode.getPointAtLength(0)
					return 'translate(' + [p.x, p.y] + ') scale(' + self.options.ring.node.scale + ')';
				})
				.attr('xlink:href', '#' + transfer.object.name)
				.transition()
					.duration(duration)
					.ease("linear")
					.attrTween("transform", function (d, i) {
						return function (t) {
							var p = pathNode.getPointAtLength(pathLength*t);
							return 'translate(' + [p.x, p.y] + ') scale(' + self.options.ring.node.scale + ')';
						}
					})
				.each('end', function() {
					g_obj.remove();
					self._addObject(thread, transfer.target.name, transfer.object.name, transfer.object.source, 0);

					self.report({ add_transfer: 1 });
				});
		};

		this.transform = function(transform_val) {
			this.thread.push({
				function: this._transform,
				args: arguments,
				name: 'transform',
				object: this
			});
		};

		this._transform = function(transform_val, scale_val) {
			var thread = this.thread.getThread(arguments);
			var transform = this.group.attr('transform');
			if (!transform) {
				transform = 'translate(0, ' + (this.svgbox.y / 2) + ') scale(' + this.scale + ')';
			}
			var scale = this.scale * scale_val;
			this.group.attr('transform', transform)
				.transition()
					.duration(this.options.duration.transform)
					.attr('transform', transform_val + ' scale(' + scale + ')')
					.each('end', function() {
						thread._next();
					});
		};

		this.report = function(report) {
			if (!this.reportElem) {
				return;
			}
			var event = new CustomEvent('multi_ring_stat', { detail: report });

			this.reportElem.dispatchEvent(event);
		};

		this.interactiveRetrieve = function(obj) {
			this.thread.push({
				function: this._interactiveRetrieve,
				args: arguments,
				name: 'interactiveRetrieve',
				object: this
			});
		};

		this._interactiveRetrieve = function(obj) {
			var thread = this.thread.getThread(arguments);

			var nodes = this.svg.selectAll('g.node');
			nodes.classed('clickable', true);

			var retrieve = function(d) {
				nodes.classed('clickable', false);
				nodes.on('click', function() {});

				var retrieve_node = d.name;
				var main_thread = self.thread;
				var blocks = d3.values(obj.blocks);

				var list = [];
				for (var i = 0; i < blocks.length; i++) {
					var tname = 'thread_' + i;
					var t = new Thread(tname, main_thread);
					list.push(t);

					self.thread = t;
					self.retrieve(retrieve_node, blocks[i].name);
					main_thread.startThread(t);
				}
				self.thread = main_thread;
				main_thread.wait.apply(main_thread, list);

				obj.sleep(500);

				list = [];
				for (var i = 0; i < blocks.length; i++) {
					var tname = 't' + i;
					var t = new Thread(tname, main_thread);
					list.push(t);

					self.thread = t;
					obj.thread = t;
					obj.receiveBlock(blocks[i].name, self, retrieve_node);
					main_thread.startThread(t);
				}
				self.thread = main_thread;
				obj.thread = main_thread;
				main_thread.wait.apply(main_thread, list);

				self.transform('translate(500, 450)', 0.4);
				obj.maximize();
				obj.sleep($('#sleep').val());
				obj.decrypt();
				obj.sleep($('#sleep').val());
				obj.merge();
				obj.onClick(function(d) {
					d3.select(this).remove();
					obj.minimize();
					self.transform('translate(0, ' + (self.svgbox.y / 2) + ')', 1);
					self.thread.start();
					nodes.classed('clickable', true)
						.on('click', retrieve);
				});

				self.thread.start();

			};
			nodes.on('click', retrieve);
		};
	};

	sim.Node = function(n) {
		var self = this;

		this.name = n.name;
		this.image = n.image;
		this.start_address = n.start_address;
		this.parent = null;
		this.ring = n.ring;

		this.propertiesGroup = null;

		this.links = {
			in: {},
			out: {},
			out_ring: {}
		};
		this.contacts = {};

		this.objects = {};

		this.getNewRing = function() {
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
			console.log(rings);
			console.log('ring_name=' + ring_name);

			return ring_name;
		};

		this.getNewAddress = function(ring) {
			var addressList = d3.values(this.contacts).findAll(function(d) {
				return d.ring == ring;
			});

			addressList = addressList.map(function(d) { return d.start_address; });
			if (ring == this.ring) {
				addressList.push(this.start_address);
			}
			addressList = addressList.map(function(d) {
				return parseInt(d.substr(0, 4), 16);
			});

			if (addressList.length == 0) {
				return new Array(41).join('0');
			}

			addressList.sort(function(a, b) {
				return a - b;
			});

			var perimeter = parseInt('1' + (new Array(5).join('0')), 16);
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
			return address.toString(16).padleft(4, '0') + (new Array(37).join('0'));
		};

		this.addLinks = function(sponsor) {
			var contact_list = sponsor.connect(this.toContact());
			console.log(contact_list);

			for (var name in contact_list) {
				this.addContact(contact_list[name]);
				var isNeighbor = true;
				if (isNeighbor) {
					this.addNeighbor(contact_list[name]);
					console.log(this.links);
				}
			}
		};

		this.connect = function(new_contact) {
			var result = {};
			for (var name in this.contacts) {
				var contact = this.contacts[name];
				result[name] = contact;
				contact.getNode().addContact(new_contact);
			}
			result[this.name] = this.toContact();
			this.addContact(new_contact);
			return result;
		};

		this.addContact = function(contact) {
			this.contacts[contact.name] = contact;
		};

		this.toContact = function() {
			return new sim.Contact(this);
		};

		this.addNeighbor = function(contact) {
			this.links.in[contact.name] = contact;
			this.links.out[contact.name] = contact;

			if (contact.ring == this.ring) {
				this.links.out_ring[contact.start_address] = contact;
			}

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

		this.store = function(thread, objectName, context) {
			var next_node = this.getResponsible(objectName);

			if (this == next_node) {
				// This is the responsible node.
				if (this.parent.options.storage_method == 'redundancy_last') {
					if (context.initial_ring == this.ring) {
						this.parent.sendToOtherRings(thread, this, objectName);
					}
				}
				thread._next();
			} else {
				thread.unshift({
					function: this.parent._storeRec,
					args: [ next_node.name, objectName, context ],
					name: '_storeRec',
					object: this.parent
				});
				this.parent._doTransfer(thread, this.name, next_node.name, objectName);
			}
		};

		this.retrieve = function(thread, objectName, context) {
			if (this.objects[objectName]) {
				thread._next();
				return;
			}

			var next_node = this.getResponsible(objectName);

			if (this == next_node) {
				// This is the responsible node.
				if (!this.objects[objectName]) {
					throw new Error('Object not found on ' + this.name + ': ' + objectName);
				}
				thread._next();
			} else {
				this.parent.doTransfer(thread, next_node.name, this.name, objectName);
				next_node.retrieve(thread, objectName, { initial: false });
			}
		};

		this.getResponsible = function(objectName) {
			var object_address = CryptoJS.SHA1(CryptoJS.SHA1(objectName)).toString();

			var ring = this.links.out_ring.map(function(d) { return d.start_address; });

			ring.push(this.start_address);
			ring.push(object_address);

			ring.sort();
			var index = ring.indexOf(object_address);
			if (index == 0) {
				index = ring.length;
			}
			var node_address = ring[index - 1];

			if (node_address == this.start_address) {
				// Object is stored.
				return this;
			}

			var node = this.links.out_ring.find(function(d) {
				return d.start_address == node_address;
			});

			return node;
		};

		this.getResponsibleForRing = function(ringName, object_address) {
			var ring = [];
			for (var nodeName in this.links.out) {
				var n = this.links.out[nodeName];
				if (n.ring != ringName) {
					continue;
				}
				if (n.start_address == object_address) {
					return n;
				}
				ring.push(n.start_address);
			}

			ring.push(object_address);

			ring.sort();
			var index = ring.indexOf(object_address);
			if (index == 0) {
				index = ring.length;
			}
			var node_address = ring[index - 1];

			var node = this.links.out.find(function(d) {
				return (d.start_address == node_address) && (d.ring == ringName);
			});

			return node;
		};

		this.showProperties = function() {
			var svg = this.parent.svg;
			var x = this.parent.svgbox.x - 200;
			var y = 25;
			this.propertiesGroup = svg.append('g')
				.classed('node_properties', true)
				.attr('transform', 'translate(' + x + ', ' + y + ')');

			var g = this.propertiesGroup.selectAll('use.object').data(d3.values(this.objects));
			g.exit().remove();
			g.enter().append('use')
				.classed('object', true)
				.attr('xlink:href', function(d, i) { return '#' + d.name; })
				.attr('x', function(d, i) { return i % 5 * 30})
				.attr('y', function(d, i) { return Math.floor(i / 5) * 30});
		};

		this.hideProperties = function() {
			this.propertiesGroup.remove();
		};
	};

	sim.Contact = function(n) {
		var self = this;

		this.name = n.name;
		this.start_address = n.start_address;
		this.ring = n.ring;
		this.node = n;

		this.getNode = function() {
			return this.node;
		};
	};
})(sim)
