//Dependencies
var order = require('../models/order'),
	moment = require('moment'),
	pdfPrinter = require('./PDFPrinter');

// default file name
var fileName = 'Orders.pdf';
var printer = {};
printer.createReport = function(date, cb) {
	var orderDate = date || moment().format('DD-MM-YYYY');
	var searchFilter = {
		orderDate: new RegExp(orderDate, 'i')
	};
	var query = order.model.find(searchFilter);
	query.populate('supplier');
	query.populate('items.product');
	query.exec(function(err, docs) {
		if (err) {
			cb(err);
		} else {
			var orders = docs,
				items = [],
				text,
				body,
				printContent = {};

			printContent.title = 'Order details. Order Date: ' + orderDate;
			printContent.body = [];

			for (var i = 0; i < orders.length; i++) {
				body = {};
				products = [];
				body.header = orders[i].supplier.supplierName;
				items = orders[i].items;
				for (var j = 0; j < items.length; j++) {
					products.push(items[j].product.productName);
				}
				body.paragraph = products;
				printContent.body.push(body);
			}
			pdfPrinter.print(printContent, fileName, cb);
		}
	});
};

module.exports = printer;