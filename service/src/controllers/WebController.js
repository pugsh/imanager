//Dependencies
var express = require('express'),
	router = express.Router(),
	path = require('path');

var VIEW_DIR = '/../../../web/src/views/';
const PageType = {
	INDEX: 'index.html',
	HOME: 'home.html',
	PRODUCT: 'product.html',
	CUSTOMER: 'customer.html',
	SUPPLIER: 'supplier.html',
	ORDER: 'order.html',
	INVOICE: 'invoice.html',
	PAGE_NOT_FOUND: '404.html',
	COMMON_DIALOG: 'common_dialog.html'
};

var getPage = function(req, res, next) {
	var pageName = req.params.page;
	if (pageName.indexOf('.') !== -1) {
		pageName = pageName.substr(0, pageName.indexOf('.'));
	}
	var page = PageType[pageName.toUpperCase()];

	if (page !== undefined) {
		res.sendFile(path.join(__dirname + VIEW_DIR + page));
	} else {
		res.sendFile(path.join(__dirname + VIEW_DIR + PageType.PAGE_NOT_FOUND));
	}
};

// html page link
router.get('/:page', getPage);

module.exports = router;