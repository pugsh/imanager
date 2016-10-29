var customer = require('../models/Customer'),
	product = require('../models/Product'),
	supplier = require('../models/Supplier'),
	order = require('../models/Order'),
	invoice = require('../models/Invoice');

const ModelType = {
	customer: customer,
	product: product,
	supplier: supplier,
	order: order,
	invoice: invoice
};

module.exports = ModelType;