//Dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	BaseDAO = require('./BaseDAO');

// define customer schema
var CustomerSchema = new Schema({
	customerId: Number,
	customerName: String,
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

// customer model
var customer = mongoose.model('customer', CustomerSchema);

// customer dao to interact with db
var customerDAO = new BaseDAO(customer, 'customerId');
module.exports = customerDAO;