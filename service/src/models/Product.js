//Dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	BaseDAO = require('./BaseDAO');

// define product schema
var ProductSchema = new Schema({
	productId: Number,
	productName: String,
	price: Number,
	suppliers: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'supplier'
		}],
		default: []
	},
	removed: {
		type: Boolean,
		default: false
	}
}, {
	versionKey: 'version'
});

// product model
var product = mongoose.model('product', ProductSchema);

// product dao to interact with db
var productDAO = new BaseDAO(product, 'productId');

module.exports = productDAO;