//Dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	BaseDAO = require('./BaseDAO');

var SaleSchema = new Schema({
	invoiceId: Number,
	productId: Number,
	customerId: Number,
	billDate: Date,
	quantity: Number
}, {
	versionKey: 'version'
});

// sale model
var sale = mongoose.model('sale', SaleSchema);

// sale dao to interact wtih db
var saleDAO = new BaseDAO(sale, 'invoiceId');
module.exports = saleDAO;