$(document).ready(function() {
	// 'use strict';
	debugger;
	var init = function() {
		products = imanager.callService({
			url: '/imanager/api/product',
			type: 'GET'
		}).data;
		var prodNames = [];
		for (var i = 0; i < products.length; i++) {
			prodNames.push(products[i].productName);
		}

		orders = imanager.callService({
			url: '/imanager/api/order?$expands=items.product,supplier',
			type: 'GET'
		}).data;

		var items = orders.reduce((list, order) => {
			var l = order.items.reduce((l, i) => {
				var copyI = Object.assign({}, i);
				copyI.orderId = order.orderId;
				copyI.orderDate = order.orderDate;
				l.push(copyI);
				return l;
			}, []);
			return list.concat(l);
		}, []);

		// cache values for later use
		imanager.cache('orders', orders);
		imanager.cache('items', items);
		imanager.cache('prodNames', prodNames);
	};

	var refreshOrderGrid = function() {
		var orders = imanager.cache('orders');
		// cerate order grid
		var header = {
			labels: ['Order Id', 'Supplier Name', 'Order Date', 'Total Item'],
			keys: [function(order) {
				return component.createBtnAsLink({
					label: order.orderId || '',
					mode: 'edit',
					identifier: 'order.orderId'
				}, imanager.showDialog);
			}, 'supplier.supplierName', 'orderDate', function(order) {
				return order.items.length || 0;
			}]
		};
		var grid = component.createGrid(orders, header);
		grid.id = 'component-table-grid-order';

		$('#order-grid').empty();
		$('#order-grid').append(grid);
		$('#' + grid.id).DataTable();
	};

	var refreshItemGrid = function() {
		var items = imanager.cache('items');
		// create item grid
		var header = {
			labels: ['Item Id', 'Item Name', 'Order Id', 'Order Date', 'Quantity'],
			keys: [function(item) {
				return component.createBtnAsLink({
					label: !(item.product) ? '' : item.product.productId,
					identifier: 'product.productId'
				}, imanager.showDialog);
			}, 'product.productName', function(item) {
				return component.createBtnAsLink({
					label: item.orderId || '',
					identifier: 'order.orderId'
				}, imanager.showDialog);
			}, 'orderDate', 'quantity']
		};

		grid = component.createGrid(items, header, false);
		grid.id = 'component-table-grid-item';

		$('#item-grid').empty();
		$('#item-grid').append(grid);
		$('#' + grid.id).DataTable();
	};

	var validate = function() {
		var medicine = $('#medicineName').val() || '';
		var supplier = getSupplier();
		var quantity = $('#quantity').val() || '';
		var numbersOnly = /\s|[0-9]*/;

		return (medicine.trim() !== '' && supplier !== '' &&
			!isNaN(quantity));
	};

	var onKeyUpHandler = function(evt) {
		var valid;
		if (evt.keyCode === 13) {
			valid = validate();
			if (valid) {
				submitOnEnter();
			} else {
				component.showMessage({
					status: 'error',
					data: 'Invalid is input.'
				});
			}
		}
	};

	var getSupplier = function() {
		var option = $('#supplier').val().trim() || '';
		var suppliers = $('#optionSection')[0].suppliers || [];
		var supplier;

		if (isNaN(option)) {
			supplier = suppliers.filter((s) => (s.supplierName === option))[0];
		} else {
			supplier = suppliers[option - 1] || '';
		}
		return supplier;
	};

	var clearForm = function() {
		$('#medicineName').val('');
		$('#supplier').val('');
		$('#quantity').val('');
	};

	var submitOnEnter = function() {
		debugger;
		var order = {};
		var item = {};
		item.quantity = $('#quantity').val();
		item.product = $('#medicineName')[0].product._id;
		order.items = [item];
		var sup = getSupplier();
		order.supplier = sup._id;
		var config = {
			url: '/imanager/api/order/create',
			type: 'POST',
			data: order
		};
		var response = imanager.callService(config);
		if (response.status === 'success') {
			//cache new order
			init();
			// refresh order grid
			refreshOrderGrid();
			refreshItemGrid();
			component.showMessage(response);
			clearForm();
			showSupplierOption(false, null);
			// change focus to medicine name
			document.getElementById('medicineName').focus();
		} else {
			component.showMessage(response);
		}
	};

	var showSupplierOption = function(show, options) {
		if (show) {
			$('#supplierOption').html(options);
			$('#optionSection').slideDown();
		} else {
			$('#optionSection').hide();
		}
	};

	var acOnSelect = function(evt) {
		debugger;
		var value = evt.value;
		var product = imanager.callService({
			url: '/imanager/api/product?$filter=productName $EQ ' + value + '&$expands=suppliers',
			type: 'GET'
		}).data[0];

		var suppliers = product.suppliers;

		$('#medicineName')[0].product = product;
		$('#optionSection')[0].suppliers = suppliers;

		var options = '';
		for (var i = 0; i < suppliers.length; i++) {
			options = options + (i + 1) + '. ' + suppliers[i].supplierName + ' ';
		}

		showSupplierOption(true, options);
		// change focus to supplier name
		$('#supplier')[0].focus();
	};

	var slidUpDownController = function(evt) {
		var id = '#' + this.id;
		var el = '#' + $(id).attr('shutter-for');
		var show = ($(id).attr('show') === 'true');
		if (show) {
			$(id).find(':first-child').attr('class', 'fa fa-minus-circle fa-lg');
			$(el).slideDown();
			$(id).attr('show', 'false');
		} else {
			$(id).find(':first-child').attr('class', 'fa fa-plus-circle fa-lg');
			$(el).slideUp();
			$(id).attr('show', 'true');
		}
	};

	// initialize and executes function
	init();
	refreshOrderGrid();
	refreshItemGrid();

	var acOptions = {
		minChars: 2,
		delimiter: /(,|;)\s*/, // regex or character
		maxHeight: 400,
		width: 300,
		zIndex: 9999,
		deferRequestBy: 10, // miliseconds
		// callback function:
		onSelect: acOnSelect,
		// local autosuggest options:
		lookup: imanager.cache('prodNames')
	};

	$('#medicineName').autocomplete(acOptions);
	$('#supplier').on('keyup', onKeyUpHandler);
	$('#quantity').on('keyup', onKeyUpHandler);
	$('#shutter-items').click(slidUpDownController);
	$('#shutter-orders').click(slidUpDownController);

	// default show
	$('#shutter-items').click();
	$('#shutter-orders').click();
});