(function() {
	// 'use strict';

	window.component = {};
	// creates a table grid
	component.createGrid = function(rows, header, showFooter) {
		var grid = document.createElement('table');
		grid.setAttribute('class', 'display');
		grid.setAttribute('style', 'width: 100%;');
		grid.setAttribute('cellspacing', '0');

		// creates table header
		var th = grid.createTHead();
		var headerRow = th.insertRow(0);
		for (var a = 0; a < header.labels.length; a++) {
			var headerCell = headerRow.insertCell(a);
			headerCell.innerHTML = header.labels[a];
		}

		// creates table body
		var tbody = document.createElement('tbody');
		grid.appendChild(tbody);
		var keys;
		for (var i = 0; i < rows.length; i++) {
			var gridRow = tbody.insertRow(i);
			gridRow.rowData = rows[i];
			var data, cell;
			for (var b = 0; b < header.keys.length; b++) {
				data = rows[i];
				cell = gridRow.insertCell(b);
				if (typeof header.keys[b] === 'function') {
					data = header.keys[b](data);
				} else {
					keys = header.keys[b].split('.');
					for (var c = 0; c < keys.length; c++) {
						if (data === null || data === undefined) {
							break;
						}
						data = data[keys[c]];
					}
				}

				if (data === null || data === undefined) {
					data = '';
				}
				if (typeof data !== 'object') {
					cell.innerHTML = data;
				} else {
					cell.appendChild(data);
				}
			}
		}
		grid.rows = rows;
		return grid;
	};

	// creates a select box
	component.createSelectBox = function(config) {
		var select = document.createElement('select');
		select.setAttribute('class', 'form-control');
		select.setAttribute('multiple', 'multiple');
		select.setAttribute('size', '20');

		var options = config.options;
		var option;
		for (var i = 0; i < options.length; i++) {
			option = document.createElement('OPTION');
			option.setAttribute('value', options[i].value);
			option.innerHTML = options[i].label;
			if (options[i].selected) {
				option.setAttribute('selected', 'selected');
			}
			select.appendChild(option);
		}
		return select;
	};

	component.createLink = function(data, callBack) {
		var link = document.createElement('a');
		link.innerHTML = data || '';
		link.href = '#';
		link.addEventListener('click', callBack);
		return link;
	};

	component.createBtnAsLink = function(data, callBack) {
		var btn = document.createElement('button');
		btn.innerHTML = data.label || '';
		btn.setAttribute('class', 'btn-as-link');
		btn.setAttribute('identifier', data.identifier);
		btn.setAttribute('mode', data.mode);
		btn.addEventListener('click', callBack);
		return btn;
	};

	component.createBtn = function(iconClass, title, callBack) {
		var span = document.createElement('span');
		span.setAttribute('class', iconClass);
		span.setAttribute('aria-hidden', 'true');
		span.setAttribute('title', title);
		span.addEventListener('click', callBack);
		return span;
	};

	component.showDialog = function(config) {
		var page = '/imanager/view/common_dialog.html',
			container = 'common-dialog';
		if (config.page) {
			page = config.page;
		}
		if (config.container) {
			container = config.container;
		}

		$('#' + container).load(page, function(res) {
			config.onLoad(config);
			$('#component-common-modal-label').html(config.title);
			$('#dialog-save').click(config.onSave);
			if (config.viewMode === 'add') {
				$('#dialog-delete').hide();
			} else {
				// attach on click listener to warning continue button
				$('#warning-continue').click(config.onDelete);
			}

			$('#component-common-modal').modal('show');
		});
	};

	component.createGroup = function(config) {
		var container = document.createElement('div');
		for (var i = 0; i < config.attributes.length; i++) {
			container.setAttribute(config.attributes[i].attr, config.attributes[i].value);
		}

		container.id = config.id || 'dialog-form';
		container.seq = 0;
		container.elements = [];
		container.addSection = function(config) {
			var div = document.createElement('div');
			div.setAttribute('class', 'form-group');
			div.id = 'dialog-form-el' + (this.seq++);

			var label = document.createElement('label');
			label.setAttribute('class', 'col-md-3 control-label');
			label.innerHTML = config.label || '';
			div.appendChild(label);

			var innerDiv = document.createElement('div');
			innerDiv.setAttribute('class', 'col-md-9');

			el = document.createElement(config.type);
			el.setAttribute('name', config.name);
			if (config.type === 'label') {
				el.setAttribute('class', 'control-label');
				el.innerHTML = config.value || '';
			} else {
				el.setAttribute('class', 'form-control');
				el.value = config.value || '';
			}
			this.elements.push(el);
			innerDiv.appendChild(el);
			div.appendChild(innerDiv);
			this.appendChild(div);

			return div.id;
		};

		container.addAddressSection = function(address) {
			var label = document.createElement('label');
			label.setAttribute('class', 'col-md-12');
			label.innerHTML = address.label || '';
			this.appendChild(label);

			var config = {
				label: 'Street',
				value: address.street || '',
				name: 'address.street',
				type: 'input'
			};
			this.addSection(config);

			config.label = 'City';
			config.name = 'address.city';
			config.value = address.city || '';
			this.addSection(config);

			config.label = 'State';
			config.name = 'address.state';
			config.value = address.state || '';
			this.addSection(config);

			config.label = 'Pin';
			config.name = 'address.pin';
			config.value = address.pin || '';
			this.addSection(config);
		};

		container.getGroupData = function() {
			var data = {};
			var els = this.elements,
				attr, className, pos = 0,
				val;
			for (var i = 0; i < els.length; i++) {
				attr = els[i].getAttribute('name');
				className = els[i].getAttribute('class');
				if (className.indexOf('label') !== -1) {
					val = els[i].innerHTML;
				} else {
					val = els[i].value;
				}

				if (attr.indexOf('.') !== -1) {
					attr = attr.split('.');
					if (data[attr[0]] === undefined) {
						data[attr[0]] = {};
					}
					data[attr[0]][attr[1]] = val;
				} else {
					data[attr] = val;
				}
			}
			return data;
		};

		return container;
	};

	component.showMessage = function(res) {
		component.clearMessage();
		var className, type = res.status,
			message = res.data;
		if (type === 'success') {
			className = 'alert alert-success';
		} else if (type === 'error' || type === 'failure') {
			className = 'alert alert-danger';
		} else if (type === 'warning') {
			className = 'alert alert-warning';
		}

		var messageEl = document.createElement('div');
		messageEl.setAttribute('class', className);
		messageEl.innerHTML = message;
		$('#message').append(messageEl);
		$(messageEl).fadeOut(10000);
	};

	component.clearMessage = function() {
		$('#message').find(':first-child').remove();
	};

})();