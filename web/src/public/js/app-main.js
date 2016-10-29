$(document).ready(function() {
	// 'use strict';

	window.imanager = {};
	// used to cache data
	imanager.cacheData = {};

	imanager.NavBarComponents = {
		Home: {
			id: "navbar-home",
			page: "home.html"
		},
		Product: {
			id: "navbar-product",
			page: "product.html"
		},
		Customer: {
			id: "navbar-customer",
			page: "customer.html"
		},
		Supplier: {
			id: "navbar-supplier",
			page: "supplier.html"
		},
		Order: {
			id: "navbar-order",
			page: "order.html"
		},
		OrderNew: {
			id: "navbar-order-new",
			page: "order.html"
		},
		OrderSearch: {
			id: "navbar-order-search",
			page: "order.html"
		},
		Invoice: {
			id: "navbar-invoice",
			page: "invoice.html"
		},
		InvoiceNew: {
			id: "navbar-invoice-new",
			page: "invoice.html"
		},
		InvoiceSearch: {
			id: "navbar-invoice-search",
			page: "invoice.html"
		}
	};

	imanager.callService = function(config) {
		var response;
		if (config === undefined) {
			throw 'config param missing';
		}

		config.contentType = 'application/json';
		if (!config.type) {
			config.type = 'GET';
		}

		if (!config.async) {
			config.async = false;
		}

		if (!config.success) {
			config.success = function(result, status, xhr) {
				response = result;
			};
		}

		if (config.data) {
			config.data = JSON.stringify(config.data);
		}

		$.ajax(config);

		return response;
	};

	imanager.clickHandler = function(evt) {
		for (var name in imanager.NavBarComponents) {
			var component = imanager.NavBarComponents[name];
			if (this.id === component.id) {
				$('#content').load(component.page);
			}
		}
	};

	imanager.addOnlickListeners = function() {
		for (var name in imanager.NavBarComponents) {
			var component = imanager.NavBarComponents[name];
			$('#' + component.id).click(imanager.clickHandler);
		}
	};

	imanager.cache = function(name, value) {
		if (value === undefined) {
			return imanager.cacheData[name];
		} else {
			imanager.cacheData[name] = value;
		}
	};

	imanager.onSave = function(evt) {
		debugger;
		var form = $('#dialog-form')[0];
		var data = form.getGroupData(),
			viewMode = form.viewMode,
			config,
			model = form.model;

		if (model === 'product') {
			var suppliers = [];
			$('#bootstrap-duallistbox-selected-list_')[0]
				.childNodes.forEach((option) => {
					suppliers.push(option.value);
				});
			data.suppliers = suppliers;
		}

		if (viewMode === 'add') {
			config = {
				url: '/imanager/api/' + model + '/create',
				type: 'POST',
				data: data
			};
		} else {
			config = {
				url: '/imanager/api/' + model + '/update',
				type: 'PUT',
				data: data
			};
		}

		var response = imanager.callService(config);
		$('#dialog-cancel').click();
		component.showMessage(response);
	};

	imanager.onDelete = function(evt) {
		debugger;
		var config = {
			warningMessage: 'Click on Continue to delete.',
			callBack: function(modal) {
				var form = $('#dialog-form')[0];
				var data = form.getGroupData(),
					model = form.model,
					key = form.key;
				var response = imanager.callService({
					url: '/imanager/api/' + model + '/remove',
					type: 'POST',
					data: {
						id: data[key]
					}
				});
				$('#' + modal).modal('hide');
				component.showMessage(response);
			}
		};

		component.showWarning(config);
	};

	imanager.fillCustomerDialog = function(config) {
		debugger;
		var customer, response;
		if (config.viewMode !== 'add') {
			response = imanager.callService({
				url: '/imanager/api/customer/' + config.data.id,
				type: 'GET'
			});
			customer = response.data[0];
		} else {
			customer = {};
			customer.customerId = '';
			customer.customerName = '';
			customer.contact = '';
			customer.address = {};
		}

		var params = {
			attributes: [{
				attr: 'class',
				value: 'form-horizontal'
			}, {
				attr: 'role',
				value: 'form'
			}]
		};
		var container = new component.createGroup(params);
		if (config.viewMode !== 'add') {
			container.addSection({
				label: 'Customer Id',
				value: customer.customerId,
				type: 'label',
				name: 'customerId'
			});
		}

		container.addSection({
			label: 'Customer Name',
			value: customer.customerName,
			type: 'input',
			name: 'customerName'
		});

		container.addSection({
			label: 'Customer Contact',
			value: customer.contact,
			type: 'input',
			name: 'contact'
		});

		var address = customer.address;
		address.label = 'Customer Address:';
		container.addAddressSection(address);

		container.data = customer;
		container.model = config.model;
		container.key = config.key;
		container.viewMode = config.viewMode;
		$('#component-modal-body').append(container);
	};

	imanager.fillOrderDialog = function(config) {
		debugger;
		var order, response;
		if (config.viewMode !== 'add') {
			response = imanager.callService({
				url: '/imanager/api/order/' + config.data.id + '?$expands=supplier,items.product',
				type: 'GET'
			});
			order = response.data[0];
		} else {
			order = {};
			order.orderId = '';
			order.supplierName = '';
			order.orderDate = '';
			order.items = [];
		}
		var params = {
			id: 'dialog-form',
			attributes: [{
				attr: 'class',
				value: 'form-horizontal'
			}, {
				attr: 'role',
				value: 'form'
			}]
		};
		var container = new component.createGroup(params);
		if (config.viewMode !== 'add') {
			container.addSection({
				label: 'Order Id',
				value: order.orderId || '',
				type: 'label',
				name: 'orderId'
			});
		}

		container.addSection({
			label: 'Supplier Name',
			value: (!(order.supplier) ? '' : order.supplier.supplierName || ''),
			type: 'label',
			name: 'supplier.supplierName'
		});

		container.addSection({
			label: 'Order Date',
			value: order.orderDate || '',
			type: 'label',
			name: 'orderDate'
		});

		params = {
			id: 'dialog-sec',
			attributes: [{
				attr: 'class',
				value: 'form-horizontal'
			}, {
				attr: 'role',
				value: 'form'
			}]
		};

		var deleteHandler = function(evt) {
			var row = $(this).closest('tr')[0];
			var deletedItems = $('#dialog-form')[0].deletedItems;
			if (deletedItems === undefined) {
				$('#dialog-form')[0].deletedItems = [row.rowData.product._id];
			} else {
				deletedItems.push(row.rowData.product._id);
			}
			$(this).closest('tr').remove();
		};
		var header = {
			labels: ['Item Name', 'Quantity', 'Delete'],
			keys: ['product.productName', 'quantity', function(product) {
				var div = document.createElement('div');
				var del = component.createBtn('fa fa-trash-o fa-lg', 'Delete', deleteHandler);
				div.appendChild(del);
				return div;
			}]
		};

		grid = component.createGrid(order.items, header);
		grid.id = 'component-table-grid-item';
		var gridWapper = document.createElement('div');
		gridWapper.appendChild(grid);
		// grid.setAttribute('class', 'table-hover table-bordered');

		container.data = order;
		container.model = config.model;
		container.key = config.key;
		container.viewMode = config.viewMode;
		// $(container).append(grid);
		$('#component-modal-body').append(container);
		$('#component-modal-body').append(gridWapper);
		$('#' + grid.id).DataTable();
	};

	imanager.saveOrderChange = function(evt) {
		debugger;
		var form = $('#dialog-form')[0];
		var data = form.data;
		var order = {
			orderId: data.orderId,
			supplier: data.supplier._id
		};

		var deletedItems = form.deletedItems;
		var modifiedItems = [],
			modifiedItem;
		for (var i = 0; i < data.items.length; i++) {
			if (deletedItems.indexOf(data.items[i].product._id) === -1) {
				modifiedItem = {
					product: data.items[i].product._id,
					quantity: data.items[i].quantity
				};
				modifiedItems.push(modifiedItem);
			}
		}
		order.items = modifiedItems;
		var config = {
			url: '/imanager/api/order/update',
			type: 'PUT',
			data: order
		};

		var response = imanager.callService(config);
		$('#dialog-cancel').click();
		component.showMessage(response);
	};

	imanager.fillProductDialog = function(config) {
		debugger;
		var product, response;
		if (config.viewMode !== 'add') {
			response = imanager.callService({
				url: '/imanager/api/product/' + config.data.id,
				type: 'GET'
			});
			product = response.data[0];
		} else {
			product = {};
			product.productId = '';
			product.productName = '';
			product.price = '';
			product.suppliers = [];
		}

		response = imanager.callService({
			url: '/imanager/api/supplier',
			type: 'GET'
		});
		suppliers = response.data;

		var options = suppliers.reduce((ops, sup) => {
			var option = {};
			if (product && product.suppliers.indexOf(sup._id) !== -1) {
				option.selected = true;
			}
			option.label = sup.supplierName;
			option.value = sup._id;
			ops.push(option);
			return ops;
		}, []);

		var params = {
			attributes: [{
				attr: 'class',
				value: 'form-horizontal'
			}, {
				attr: 'role',
				value: 'form'
			}]
		};

		var container = new component.createGroup(params);
		if (config.viewMode !== 'add') {
			container.addSection({
				label: 'Product Id',
				value: product.productId,
				type: 'label',
				name: 'productId'
			});
		}

		container.addSection({
			label: 'Product Name',
			value: product.productName,
			type: 'input',
			name: 'productName'
		});

		container.addSection({
			label: 'Price',
			value: product.price,
			type: 'input',
			name: 'price'
		});

		var supplierOption = component.createSelectBox({
			options: options
		});
		container.appendChild(supplierOption);

		container.data = product;
		container.model = config.model;
		container.key = config.key;
		container.viewMode = config.viewMode;
		$('#component-modal-body').append(container);
		supplierOption.id = 'dialog-supplierOptions';
		$('#dialog-supplierOptions').bootstrapDualListbox({
			nonSelectedListLabel: 'Available Suppliers',
			selectedListLabel: 'Selected Suppliers',
			preserveSelectionOnMove: 'move',
			selectorMinimalHeight: 258
		});
	};

	imanager.fillSupplierDialog = function(config) {
		debugger;
		var supplier, response;
		if (config.viewMode !== 'add') {
			response = imanager.callService({
				url: '/imanager/api/supplier/' + config.data.id,
				type: 'GET'
			});
			supplier = response.data[0];
		} else {
			supplier = {};
			supplier.supplierId = '';
			supplier.supplierName = '';
			supplier.ownerName = '';
			supplier.contact = '';
			supplier.address = {};
		}

		var params = {
			attributes: [{
				attr: 'class',
				value: 'form-horizontal'
			}, {
				attr: 'role',
				value: 'form'
			}]
		};
		var container = new component.createGroup(params);
		if (config.viewMode !== 'add') {
			container.addSection({
				label: 'Supplier Id',
				value: supplier.supplierId,
				type: 'label',
				name: 'supplierId'
			});
		}

		container.addSection({
			label: 'Supplier Name',
			value: supplier.supplierName,
			type: 'input',
			name: 'supplierName'
		});

		container.addSection({
			label: 'Owner Name',
			value: supplier.ownerName,
			type: 'input',
			name: 'ownerName'
		});

		container.addSection({
			label: 'Supplier Contact',
			value: supplier.contact,
			type: 'input',
			name: 'contact'
		});

		var address = supplier.address;
		address.label = 'Supplier Address:';
		container.addAddressSection(address);

		container.data = supplier;
		container.model = config.model;
		container.key = config.key;
		container.viewMode = config.viewMode;
		$('#component-modal-body').append(container);
	};

	imanager.showDialog = function(evt) {
		debugger;
		var identifier = this.getAttribute('identifier');
		var mode = this.getAttribute('mode');
		var config = {
			container: 'common-dialog',
			data: {
				id: this.innerHTML,
				identifier: identifier
			},
			onDelete: imanager.onDelete,
			onSave: imanager.onSave,
			viewMode: mode
		};
		switch (identifier) {
			case 'order.orderId':
				config.title = 'Order Details';
				config.onLoad = imanager.fillOrderDialog;
				config.onSave = imanager.saveOrderChange;
				config.model = 'order';
				config.key = 'orderId';
				break;
			case 'product.productId':
				config.title = 'Product Details';
				config.onLoad = imanager.fillProductDialog;
				config.model = 'product';
				config.key = 'productId';
				break;
			case 'supplier.supplierId':
				config.title = 'Supplier Details';
				config.onLoad = imanager.fillSupplierDialog;
				config.model = 'supplier';
				config.key = 'supplierId';
				break;
			case 'customer.customerId':
				config.title = 'Customer Details';
				config.onLoad = imanager.fillCustomerDialog;
				config.model = 'customer';
				config.key = 'customerId';
				break;
		}
		component.showDialog(config);
	};

	imanager.addOnlickListeners();
});