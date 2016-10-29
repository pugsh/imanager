$(document).ready(function() {
	// 'use strict';
	
	var refreshGrid = function() {
		var config = {
			url: "/imanager/api/supplier",
			type: "GET"
		};

		var suppliers = imanager.callService(config).data;

		var header = {
			labels: ['Supplier Id', 'Supplier Name', 'Owner Name', 'Contact', 'Address'],
			keys: [function(supplier) {
				return component.createBtnAsLink({
					label: supplier.supplierId,
					identifier: 'supplier.supplierId'
				}, imanager.showDialog);
			}, 'supplierName', 'ownerName', 'contact', function(supplier) {
				var address = supplier.address;
				return address.street + ' ' + address.city + ' ' + address.state + '-' + address.pin;
			}]
		};
		var grid = component.createGrid(suppliers, header);
		grid.id = 'component-table-grid-supplier';
		$('#supplier-content').append(grid);
		$('#' + grid.id).DataTable();
	};

	$('#add-supplier').click(imanager.showDialog);
	refreshGrid();
});