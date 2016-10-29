$(document).ready(function() {
	// 'use strict';

	var refreshGrid = function() {
		var config = {
			url: "/imanager/api/customer",
			type: "GET"
		};

		var customers = imanager.callService(config).data;

		var header = {
			labels: ['Customer Id', 'Customer Name', 'Contact', 'Address'],
			keys: [function(customer) {
				return component.createBtnAsLink({
					label: customer.customerId,
					identifier: 'customer.customerId'
				}, imanager.showDialog);
			}, 'customerName', 'contact', function(customer) {
				var address = customer.address;
				return address.street + ' ' + address.city + ' ' + address.state + '-' + address.pin;
			}]
		};

		var grid = component.createGrid(customers, header);
		grid.id = 'component-table-grid-customer';
		$('#customer-content').append(grid);
		$('#' + grid.id).DataTable({
			aoColumns: [{
				sWidth: "10%",
				bSearchable: false
			}, {
				sWidth: "30%",
				bSearchable: true
			}, {
				sWidth: "20%",
				bSearchable: true,
				bSortable: false
			}, {
				sWidth: "40%",
				bSearchable: true,
				bSortable: false
			}]
		});
	};

	refreshGrid();
	$('#add-customer').click(imanager.showDialog);
});