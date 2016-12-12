//Dependencies
var order = require('../models/Order'),
	moment = require('moment'),
	pdfPrinter = require('./PDFPrinter');

// default file name
var fileName = 'Orders.pdf';
var printer = {};
printer.createReport = function (date, cb) {
	var orderDate = date || moment().format('DD-MM-YYYY');
	var createdAt = moment().format('DD-MM-YYYY H:mm:ss');
	var searchFilter = {
		orderDate: new RegExp(orderDate, 'i')
	};
	var query = order.model.find(searchFilter);
	query.populate('supplier');
	query.populate('items.product');
	query.exec(function (err, docs) {
		if (err) {
			cb(err);
		} else {
			var orders = docs,
				items = [],
				text,
				body,
				printContent = {};

			printContent.title = 'Order Summary Report';
			printContent.reportingPeriod = 'Order Date: ' + orderDate;
			printContent.createdOn = 'Created At: ' + createdAt;
			printContent.body = [];

			for (var i = 0; i < orders.length; i++) {
				if (orders[i].supplier && orders[i].supplier.supplierName) {
					body = {};
					products = [];
					body.header = orders[i].supplier.supplierName;
					items = orders[i].items;
					for (var j = 0; j < items.length; j++) {
						if (items[j].product && items[j].product.productName) {
							products.push(items[j].product.productName);
						}
					}
					body.paragraph = products;
					printContent.body.push(body);
				}
			}
			pdfPrinter.print(printContent, fileName, cb);
		}
	});
};

module.exports = printer;