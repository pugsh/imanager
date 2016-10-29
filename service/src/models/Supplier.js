//Dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	BaseDAO = require('./BaseDAO');

// define supplier schema
var SupplierSchema = new Schema({
	supplierId: Number,
	supplierName: String,
	ownerName: String,
	contact: String,
	address: {
		street: String,
		city: String,
		state: String,
		pin: Number
	},
	removed: {
		type: Boolean,
		default: false
	}
}, {
	versionKey: 'version'
});

// supplier model
var supplier = mongoose.model('supplier', SupplierSchema);

// supplier dao to interact with the db
var supplierDAO = new BaseDAO(supplier, 'supplierId');
module.exports = supplierDAO;