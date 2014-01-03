(function(sim, undefined) {
	sim.MultiRingDS = function(svg) {
		var self = this;

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
		this.firstNodeName = null;

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

		this.addRing = function(thread, name, i) {
			thread.push({
				function: this._addRing,
				args: arguments,
				name: 'addRing',
				object: this
			});
		};

		this._addRing = function(thread, name, i) {
			this.rings[name] = {
				name: name,
				index: i,
				nodes: {}
			};
			this.repaintRings(thread);
		};

		this.repaintMain = function(thread) {
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
					thread.next();
				});
		};

		this.repaintRings = function(thread) {
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
						self.repaintMain(thread);
						doNext = false;
					}
				});


		};

		this.addFirstNode = function(thread, node) {
			node.parent = this;
			thread.push({
				function: this._addFirstNode,
				args: arguments,
				name: 'addFirstNode',
				object: this
			});
		};

		this._addFirstNode = function(thread, node) {
			node.start_address = sim.NodeUtils.getAddressFromAngle(10);
			node.ring = jlg.find(d3.values(this.rings), function(d) { return d.index == 0; }).name;
			node.addContact(node.toContact());

			this.nodes[node.name] = node;
			this.rings[node.ring].nodes[node.name] = node;
			this.firstNodeName = node.name;

			this._repaintNodes(thread);
		};

		this.addNode = function(thread, node, sponsorName) {
			node.parent = this;
			thread.push({
				function: this._addNode,
				args: arguments,
				name: 'addNode',
				object: this
			});
		};

		this._addNode = function(thread, node, sponsorName) {
			var nodeNames = d3.keys(this.nodes);
			if (nodeNames.length == 0) {
				this._addFirstNode(thread, node);
				return;
			}
			var sponsor = this.nodes[nodeNames[0]];
			console.log(sponsorName);
			if (sponsorName) {
				sponsor = this.nodes[sponsorName];
			}
			if (!sponsor) {
				throw new Error('sponsor not defined.');
			}

			node._connectTo(thread, sponsor);
		};

		this.removeNode = function(thread, nodeName) {
			thread.push({
				function: this._removeNode,
				args: arguments,
				name: 'removeNode',
				object: this
			});
		};

		this._removeNode = function(thread, nodeName) {
			// to be sure there will be no selection afterwards.
			this.selectedNodeName = null;

			// remove the links inside the global view.
			for (var name in this.links) {
				var toBeDeleted = (this.links[name].source.name == nodeName)
					|| (this.links[name].target.name == nodeName)

				if (toBeDeleted) {
					delete this.links[name];
				}
			}
			// remove the node inside the global view.
			var node = this.nodes[nodeName];
			var ring = this.rings[node.ring];
			delete ring.nodes[nodeName];
			delete this.nodes[nodeName];

			// Maintain the firstNodeName.
			if (this.firstNodeName == node.name) {
				if (this.nodes.length > 0) {
					this.firstNodeName = d3.values(this.nodes)[0].name;
				} else {
					this.firstNodeName = null;
				}
			}

			// refresh the painting.
			this._repaintNodes(thread);
		};

		this.refreshNode = function(thread, nodeName) {
			thread.push({
				function: this._refreshNode,
				args: arguments,
				name: '_refreshNode',
				object: this
			});
		};

		this._refreshNode = function(thread, nodeName) {
			var node = this.nodes[nodeName];
			node._refresh(thread);
		};

		this.do_retrieveInterval = function(thread, nodeName, interval) {
			thread.unshift({
				function: this._retrieveInterval,
				args: arguments,
				name: 'do_retrieveInterval',
				object: this
			});
		};

		this._retrieveInterval = function(thread, nodeName, interval) {
			console.log('Retrieve interval: ' + interval.start_address + ' ' + interval.end_address);
			var node_list = this.nodes[nodeName].getRecoveryNodes(interval);

			var new_thread = new Thread('retrieve_interval');

			var list = [];
			for (var i = 0; i < node_list.length; i++) {
				console.log('node_list[' + i + ']=' + node_list[i]);
				var t = new Thread('copy_' + node_list[i] + '_' + nodeName);
				list.push(t);
				t.push({
					function: this._copy,
					args: [ t, node_list[i], nodeName, interval ],
					name: 'copy',
					object: this
				});
				new_thread.startThread(t);
			}
			new_thread.wait.apply(new_thread, list);
			new_thread.push({
				function: function() {
					thread.next();
				},
				args: [],
				name: 'thread.next',
				object: this
			});
			new_thread.start();
		};

		this.copy = function(thread, sourceName, targetName, interval) {
			thread.push({
				function: this._copy,
				args: arguments,
				name: 'copy',
				object: this
			});
		};

		this.do_copy = function(thread, sourceName, targetName, interval) {
			thread.unshift({
				function: this._copy,
				args: arguments,
				name: 'copy',
				object: this
			});
		};

		this._copy = function(thread, sourceName, targetName, interval) {
			console.log(thread.name + ': Copy from ' + sourceName + ' to ' + targetName);
			var source = this.nodes[sourceName];
			var target = this.nodes[targetName];
			target.addNeighbor(source.toContact());

			thread.unshift({
				function: this._performBulkTransfer,
				args: arguments,
				name: '_performBulkTransfer',
				object: this
			});

			this._repaintNodes(thread);
		};

		this._performBulkTransfer = function(thread, sourceName, targetName, interval) {
			var duration = this.options.duration.doTransfer_bulk;

			var source = this.nodes[sourceName];
			var target = this.nodes[targetName];

			var pathNode = d3.select('#' + sourceName + '_' + targetName).node();
			var pathLength = pathNode.getTotalLength();
			var g_obj = this.group.append('g')
				.classed('transfer', true);


			var circle = g_obj.append('circle')
				.classed('bulk_object', true)
				.attr('cx', 0)
				.attr('cy', 0)
				.attr('r', 15);
//			g_obj.append('text')
//				.text('B')
//				.attr('x', 20)
//				.attr('y', 20);
			g_obj.transition()
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
					console.log(source);
					for (var address in source.objects) {
						console.log(thread.name + ': address=' + address);
						if (!source.isInsideInterval(address, interval)) {
							console.log(thread.name + ': address is not inside interval.');
							console.log(interval);
							continue;
						}
						var object = source.objects[address];
						target.objects[address] = object;
					}

					self._repaintObjects(thread, duration);

					self.report({ add_transfer: 1 });
				});
		};

		this.do_repaintNodes = function(thread) {
			thread.unshift({
				function: this._repaintNodes,
				args: arguments,
				name: '_repaintNodes',
				object: this
			});
		};

		this.repaintNodes = function(thread) {
			thread.push({
				function: this._repaintNodes,
				args: arguments,
				name: '_repaintNodes',
				object: this
			});
		};

		this._repaintNodes = function(thread) {
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
					var thread = new Thread('select');
					if (self.isSelected(d)) {
						self.unselectNode(thread, d);
					} else {
						self.selectNode(thread, d);
					}
					thread.finish();
					thread.start();
				});

			new_g.append('image')
				.attr('xlink:href', function(d) { return d.image; })
				.attr('transform', 'translate(-25, -25)')
				.attr('width', 50)
				.attr('height', 50);

			if (new_g.empty()) {
				console.log(thread.name + ': _repaintNodes: No new node.');
				self.repaintLinks(thread);
			}
			var doNext = true;
			new_g.transition()
				.duration(this.options.duration.addNode)
				.style('opacity', 1)
				.each('end', function() {
					if (doNext) {
						console.log('New node: repaintLinks.');
						self.repaintLinks(thread);
						doNext = false;
					}
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

			var node = jlg.find(d3.values(nodes), function(d) {
				return d.start_address == node_address;
			});

			return node;
		};

		this.repaintLinks = function(thread) {
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
				console.log(thread.name + ': repaintLinks: new path is empty: thread.next');
				thread.next();
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
							console.log('repaintLinks: next');
							doNext = false;
							thread.next();
						}
					});
		};

		this.addObject = function(thread, nodeName, name, source) {
			thread.push({
				function: this._addObject,
				args: arguments,
				name: 'addObject',
				object: this
			});
		};

		this._addObject = function(thread, nodeName, address, source, duration) {
			var node = this.nodes[nodeName];
			var obj = {
				address: address,
				source: source
			};
			node.objects[obj.address] = obj;
			this.objects[obj.address] = obj;

			this._repaintObjects(thread, duration);
		};

		this._repaintObjects = function(thread, duration) {
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
				console.log('repaintObjects empty: next');
				thread.next();
			}
			var doNext = true;
			new_objects.append('rect')
				.classed('object', true)
				.attr('width', 25)
				.attr('height', 25)
				.attr('x', 0)
				.attr('y', 0)
				.attr('fill', function(d) {
					return sim.NodeUtils.getColorFromAddress(d.address);
				})
				.style('opacity', 0)
				.transition()
					.duration(duration)
					.style('opacity', 1)
					.each('end', function() {
						if (doNext) {
							console.log('repaintObjects: next');
							doNext = false;
							thread.next();
						}
					});

		};

		this.store = function(thread, nodeName, objectAddress) {
			thread.push({
				function: this._store,
				args: arguments,
				name: 'store',
				object: this
			});
		};

		this._store = function(thread, nodeName, objectAddress) {
			var node = this.nodes[nodeName];
			node._store(thread, objectAddress, this.options.storage_method);
		};

		this.retrieve = function(thread, nodeName, objectAddress) {
			thread.push({
				function: this._retrieve,
				args: arguments,
				name: 'retrieve',
				object: this
			});
		};

		this._retrieve = function(thread, nodeName, objectAddress) {
			console.log('_retrieve');
			try {
				var node = this.nodes[nodeName];
				node._retrieve(thread, objectAddress);
			} catch (e) {
				console.log(e.message);
				thread.next();
			}
		};

		this.do_transfer = function(thread, sourceName, targetName, objectAddress) {
			thread.unshift({
				function: this._transfer,
				args: [ thread, sourceName, targetName, objectAddress ],
				name: '_transfer',
				object: this
			});
		};

		this.transfer = function(thread, sourceName, targetName, objectAddress) {
			thread.push({
				function: this._transfer,
				args: [ thread, sourceName, targetName, objectAddress ],
				name: '_transfer',
				object: this
			});
		};

		this._transfer = function(thread, sourceName, targetName, objectAddress) {
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
				.classed('transfer', true);


			g_obj.append('rect')
				.classed('object', true)
				.attr('width', 25)
				.attr('height', 25)
				.attr('x', -12)
				.attr('y', -12)
				.attr('fill', sim.NodeUtils.getColorFromAddress(transfer.object.address));
			g_obj.transition()
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

		this.transform = function(thread, transform_val) {
			thread.push({
				function: this._transform,
				args: arguments,
				name: 'transform',
				object: this
			});
		};

		this._transform = function(thread, transform_val, scale_val) {
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
						thread.next();
					});
		};

		this.report = function(report) {
			if (!this.reportElem) {
				return;
			}
			var event = new CustomEvent('multi_ring_stat', { detail: report });

			this.reportElem.dispatchEvent(event);
		};

		this.interactiveRetrieve = function(thread, obj) {
			thread.push({
				function: this._interactiveRetrieve,
				args: arguments,
				name: 'interactiveRetrieve',
				object: this
			});
		};

		this._interactiveRetrieve = function(thread, obj) {
			var nodes = this.svg.selectAll('g.node');
			nodes.classed('clickable', true);

			var retrieve = function(d) {
				nodes.classed('clickable', false);
				nodes.on('click', function() {});

				var retrieve_node = d.name;
				var blocks = d3.values(obj.blocks);

				var list = [];
				for (var i = 0; i < blocks.length; i++) {
					var tname = 'thread_' + i;
					var t = new Thread(tname);
					list.push(t);

					self.retrieve(t, retrieve_node, blocks[i].name);
					thread.do_startThread(t);
				}
				thread.wait.apply(thread, list);

				obj.sleep(500);

				list = [];
				for (var i = 0; i < blocks.length; i++) {
					var tname = 't' + i;
					var t = new Thread(tname);
					list.push(t);

					obj.receiveBlock(t, blocks[i].name, self, retrieve_node);
					thread.do_startThread(t);
				}
				thread.wait.apply(thread, list);

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
					thread.start();
					nodes.classed('clickable', true)
						.on('click', retrieve);
				});

				thread.start();

			};
			nodes.on('click', retrieve);
		};

		this.isSelected = function(d) {
			return this.selectedNodeName == d.name;
		};

		this.selectNode = function(thread, d) {
			thread.push({
				function: this._selectNode,
				args: arguments,
				name: '_selectNode',
				object: this
			});
		};

		this._selectNode = function(thread, d) {
			this.selectedNodeName = d.name;
			this._repaintNodes(thread);
			this.options.callback.onNodeSelected(d);
		};

		this.unselectNode = function(thread, d) {
			thread.push({
				function: this._unselectNode,
				args: arguments,
				name: '_unselectNode',
				object: this
			});
		};

		this._unselectNode = function(thread, d) {
			this.selectedNodeName = null;
			this.options.callback.onNodeDeselected(d);
			this._repaintNodes(thread);
		};

		this.setOption = function(thread, key, value) {
			thread.push({
				function: this._setOption,
				args: arguments,
				name: '_setOption',
				object: this
			});
		};

		this._setOption = function(thread, key, value) {
			console.log(thread.name + ': ' + key + '=' + value);
			this.options[key] = value;
			thread.next();
		};
	};
})(sim)
