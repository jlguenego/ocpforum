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
		this.defs.append('filter')
			.attr('id', 'darker')
			.append('feColorMatrix')
				.attr('type', 'matrix')
				.attr('in', 'SourceGraphic')
				.attr('values', '0.8 0 0 0 -0.2 0 0.8 0 0 -0.2 0 0 0.8 0 -0.2 0 0 0 1 0');


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
			storage_method: 'redundancy_first',
			callback: {
				onNodeSelected: function(node) {},
				onNodeDeselected: function(node) {}
			}
		};

		this.rings = {};
		this.nodes = {};
		this.links = {};
		this.objects = {};

		this.scale = 1;

		this.selectedNodeName = null;

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
				.classed('ring', true)
				.attr('data-name', function(d) { return d.name; });
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

			node.start_address = node.getAddressFromAngle(10);
			node.ring = d3.values(this.rings).find(function(d) { return d.index == 0; }).name;

			this.nodes[node.name] = node;
			this.rings[node.ring].nodes[node.name] = node;

			this.refreshNodes(thread);
		};

		this.addNode = function(node, sponsorName) {
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

			var nodeNames = d3.keys(mr.nodes);
			if (nodeNames.length == 0) {
				this._addFirstNode(thread, node);
				return;
			}
			var sponsor = this.nodes[nodeNames[0]];
			if (sponsorName) {
				sponsor = this.nodes[sponsorName];
			}
			if (!sponsor) {
				throw new Error('sponsor not defined.');
			}
			node.connectTo(sponsor);
			this.refreshNodes(thread);
		};

		this.removeNode = function(nodeName) {
			this.thread.push({
				function: this._removeNode,
				args: arguments,
				name: 'removeNode',
				object: this
			});
		};

		this._removeNode = function(nodeName) {
			var thread = this.thread.getThread(arguments);

			this.selectedNodeName = null;

			for (var name in this.links) {
				var toBeDeleted = (this.links[name].source.name == nodeName)
					|| (this.links[name].target.name == nodeName)

				if (toBeDeleted) {
					delete this.links[name];
				}
			}

			var node = this.nodes[nodeName];
			var ring = this.rings[node.ring];
			delete ring.nodes[nodeName];
			delete this.nodes[nodeName];

			this.refreshNodes(thread);
		};

		this.refreshNode = function(nodeName) {
			this.thread.push({
				function: this._refreshNode,
				args: arguments,
				name: '_refreshNode',
				object: this
			});
		};

		this._refreshNode = function(nodeName) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			node.refreshNeighbors();
			this.refreshNodes(thread);
		};

		this.refreshNodes = function(thread) {
			var dataset = d3.values(this.rings);
			var ring_g = this.svg.selectAll('g.ring').data(dataset, function(d) { return d.name; });

			var node = ring_g.selectAll('g.node')
				.data(function(d, i) { return d3.values(d.nodes); }, function(d) { return d.name; });
			node.exit().transition()
				.duration(this.options.duration.addNode)
				.style('opacity', 0)
				.remove();

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
				})
				.on('click', function(d) {
					if (self.isSelected(d)) {
						self._unselect(thread, d);
					}else {
						self._select(thread, d);
					}
				});

			new_g.append('image')
				.attr('xlink:href', function(d) { return d.image; })
				.attr('transform', 'translate(-25, -25)')
				.attr('width', 50)
				.attr('height', 50);

			if (new_g.empty()) {
				self.refreshLinks(thread);
			}
			new_g.transition()
				.duration(this.options.duration.addNode)
				.style('opacity', 1)
				.each('end', function() {
					self.refreshLinks(thread);
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

			node.attr('filter', function(d) {
				if (d.name == self.selectedNodeName) {
					return 'url(' + window.location.href + '#darker)';
				}
				return null;
			})
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

			var path = this.links_g.selectAll('path').data(dataset, function(d) { return d.id; });
			path.exit().transition()
				.duration(this.options.duration.addNode)
				.style('opacity', 0)
				.remove();

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

		this._addObject = function(nodeName, address, source, duration) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			var obj = {
				address: address,
				source: source
			};
			node.objects[obj.address] = obj;
			this.objects[obj.address] = obj;

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
					return d.address;
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
			new_objects.append('rect')
				.classed('object', true)
				.attr('xlink:href', function(d) { return '#' + d.address; })
				.attr('width', 25)
				.attr('height', 25)
				.attr('x', 0)
				.attr('y', 0)
				.attr('fill', function(d) {
					var perimeter = parseInt('1' + new Array(41).join('0'), 16);
					var hue = (parseInt(d.address, 16) / perimeter) * 360;
					return 'hsl(' + hue + ', 100%, 90%)';
				})
				.style('opacity', 0)
				.transition()
					.duration(duration)
					.style('opacity', 1)
					.each('end', function() {
						thread._next();
					});

		};

		this.store = function(nodeName, objectAddress) {
			this.thread.push({
				function: this._store,
				args: arguments,
				name: 'store',
				object: this
			});
		};

		this._store = function(nodeName, objectAddress) {
			var thread = this.thread.getThread(arguments);

			if (this.options.storage_method == 'redundancy_first') {
				this._storeRF(thread, nodeName, objectAddress);
			} else if (this.options.storage_method == 'redundancy_last') {
				this._storeRL(thread, nodeName, objectAddress);
			}
		};

		this._storeRF = function(nodeName, objectAddress) {
			var thread = this.thread.getThread(arguments);

			this._storeRec(thread, nodeName, objectAddress, {});

			this.sendToOtherRings(thread, this.nodes[nodeName], objectAddress);

		};

		this._storeRL = function(nodeName, objectAddress) {
			var thread = this.thread.getThread(arguments);

			this._storeRec(thread, nodeName, objectAddress, { initial_ring: node.ring });
		};

		this.sendToOtherRings = function(thread, node, objectAddress) {
			for (var ringName in this.rings) {
				if (ringName == node.ring) {
					continue;
				}

				var ringNode = node.getResponsibleForRing(ringName, objectAddress);

				if (!ringNode) {
					continue;
				}

				var tname = objectAddress + '_' + ringName;
				var new_thread = new Thread(tname, thread);
				this.doTransfer(new_thread, node.name, ringNode.name, objectAddress);
				new_thread.push({
					function: this._storeRec,
					args: [ ringNode.name, objectAddress, {} ],
					name: '_storeRec',
					object: this
				});
				new_thread.start();
			}
		};

		this._storeRec = function(nodeName, objectAddress, context) {
			var thread = this.thread.getThread(arguments);
			// there are 2 visual steps (->thread):
			// 1) refresh node
			// 2) do the effective store
			thread.unshift({
				function: this._refreshNode,
				args: [ nodeName ],
				name: '_refreshNode',
				object: this
			});
			thread.unshift({
				function: this._storeOperation,
				args: arguments,
				name: '_storeOperation',
				object: this
			});
			thread._next();
		}

		this._storeOperation = function(nodeName, objectAddress, context) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			console.log('objectAddress=' + objectAddress);
			var next_node = node.getResponsible(objectAddress);

			if (node.name == next_node.name) {
				// This is the responsible node.
				if (this.options.storage_method == 'redundancy_last') {
					if (context.initial_ring == node.ring) {
						this.sendToOtherRings(thread, this, objectAddress);
					}
				}
				thread._next();
			} else {
				thread.unshift({
					function: this._storeRec,
					args: [ next_node.name, objectAddress, context ],
					name: '_storeRec',
					object: this
				});
				this._doTransfer(thread, node.name, next_node.name, objectAddress);
			}
		};

		this.retrieve = function(nodeName, objectAddress) {
			this.thread.push({
				function: this._retrieve,
				args: arguments,
				name: 'retrieve',
				object: this
			});
		};

		this._retrieve = function(nodeName, objectAddress) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];

			node.retrieve(thread, objectAddress, { initial: true });
		};

		this.doTransfer = function(thread, sourceName, targetName, objectAddress) {
			thread.unshift({
				function: this._doTransfer,
				args: [ sourceName, targetName, objectAddress ],
				name: 'doTransfer',
				object: this
			});
		};

		this._doTransfer = function(sourceName, targetName, objectAddress) {
			var thread = this.thread.getThread(arguments);
			var source = this.nodes[sourceName];
			var target = this.nodes[targetName];
			var transfer = {
				source: source,
				target: target,
				object: this.objects[objectAddress]
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
				.attr('xlink:href', '#' + transfer.object.address)
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
					self._addObject(thread, transfer.target.name, transfer.object.address, transfer.object.source, 0);

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

		this.isSelected = function(d) {
			return this.selectedNodeName == d.name;
		};

		this.select = function(d) {
			this.thread.push({
				function: this._select,
				args: arguments,
				name: '_select',
				object: this
			});
		};

		this._select = function(d) {
			var thread = this.thread.getThread(arguments);
			this.selectedNodeName = d.name;
			this.refreshNodes(thread);
			this.options.callback.onNodeSelected(d);
		};

		this.unselect = function(d) {
			this.thread.push({
				function: this._unselect,
				args: arguments,
				name: '_unselect',
				object: this
			});
		};

		this._unselect = function(d) {
			var thread = this.thread.getThread(arguments);
			this.selectedNodeName = null;
			this.refreshNodes(thread);
			this.options.callback.onNodeDeselected(d);
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
			this.refreshNeighbors();

			var contactList = d3.values(this.contacts).findAll(function(d) {
				return d.ring == ring;
			});

			var addressList = contactList.map(function(d) { return d.start_address; });
			if (ring == this.ring) {
				addressList.push(this.start_address);
			}
			addressList = addressList.map(function(d) {
				return parseInt(d.substr(0, 4), 16);
			});

			if (addressList.length == 0) {
				console.log('first node ?');
				return this.getAddressFromAngle(10);
			}

			addressList.sort(function(a, b) {
				return a - b;
			})

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
			address = address % perimeter;
			return address.toString(16).padleft(4, '0') + (new Array(37).join('0'));
		};

		this.addLinks = function(sponsor) {
			var contact_list = sponsor.accept(this.toContact());

			for (var name in contact_list) {
				var contact = contact_list[name];
				this.addContact(contact);
			}

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

			var r1 = this.is2NSuccessor(ring, this.start_address, contact.start_address);
			var r2 = this.is2NSuccessor(ring, contact.start_address, this.start_address);

			return r1 || r2;
		};

		this.accept = function(new_contact) {
			var result = {};
			this.refreshNeighbors();
			for (var name in this.contacts) {
				var contact = this.contacts[name];
				result[name] = contact;
				var node = contact.getNode();
				node.addContact(new_contact);
				node.refreshNeighbors();
			}
			result[this.name] = this.toContact();
			this.addContact(new_contact);
			return result;
		};

		this.refreshNeighbors = function() {
			for (var name in this.neighbors) {
				var contact = this.neighbors[name];
				this.ping(contact);
				if (contact.ring == this.ring) {
					if (!this.isNeighborInsideRing(contact)) {
						this.removeNeighbor(contact);
					}
				} else {
					var responsible_contact = this.getResponsibleContact(contact.ring, this.start_address);
					if (responsible_contact.name != contact.name) {
						var c = contact.getNode().getResponsibleContact(this.ring, contact.start_address);
						if (c.name != this.name) {
							this.removeNeighbor(contact);
						}
					}
				}
			}
			// add neighbors from unconnected rings.
			console.log('maintaining neighbors on other rings.');
			for (var ring in this.parent.rings) {
				if (ring == this.ring) {
					continue;
				}
				console.log('handling ring: ' + ring);
				if (!this.isNeighborsForRing(ring)) {
					this.createNeighborForRing(ring);
				}
			}
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
				console.log('entering loop');
				var contact = this.getResponsibleContact(ring, this.start_address);
				if (!contact) {
					console.log(this.name + ': I have no contact for ring ' + ring);
					return;
				}
				console.log('contact = ' + contact.name);
				if (this.ping(contact)) {
					console.log('ping ok');
					this.addNeighbor(contact);
					break;
				} else {
					console.log('cannot ping ' + contact.name);
				}
			}
		};

		this.addContact = function(contact) {
			this.contacts[contact.name] = contact;

			if (!this.rings[contact.ring]) {
				this.rings[contact.ring] = {};
			}
			this.rings[contact.ring][contact.start_address] = contact;
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
			console.log(this.name + 'removes neighbors ' + contact.name);
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

		this.retrieve = function(thread, objectAddress, context) {
			if (this.objects[objectAddress]) {
				thread._next();
				return;
			}

			var next_node = this.getResponsible(objectAddress);

			if (this == next_node) {
				// This is the responsible node.
				if (!this.objects[objectAddress]) {
					throw new Error('Object not found on ' + this.name + ': ' + objectAddress);
				}
				thread._next();
			} else {
				this.parent.doTransfer(thread, next_node.name, this.name, objectAddress);
				next_node.retrieve(thread, objectAddress, { initial: false });
			}
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
