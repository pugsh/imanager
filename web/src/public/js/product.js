$(document).ready(function() {
	// 'use strict';
	
	var refreshGrid = function() {
		var cofig = {
			url: "/imanager/api/product",
			type: "GET"
		};

		var products = imanager.callService(cofig).data;

		var header = {
			labels: ['Product Id', 'Product Name', 'Price'],
			keys: [function(product) {
				return component.createBtnAsLink({
					label: product.productId,
					identifier: 'product.productId'
				}, imanager.showDialog);
			}, 'productName', 'price']
		};
		var grid = component.createGrid(products, header);
		grid.id = 'component-table-grid-product';
		$('#product-content').append(grid);
		$('#' + grid.id).DataTable();
	};

	refreshGrid();
	$('#add-product').click(imanager.showDialog);
});