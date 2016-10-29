//Dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	BaseDAO = require('./BaseDAO'),
	moment = require('moment');

var ItemSchema = new Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'product'
	},
	quantity: Number
}, {
	_id: false
});

var OrderSchema = new Schema({
	orderId: Number,
	supplier: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'supplier'
	},
	orderDate: String,
	lastUpdateDate: String,
	items: [ItemSchema]
}, {
	versionKey: 'version'
});

// order model
var order = mongoose.model('order', OrderSchema);

// order dao to interact with db
var orderDAO = new BaseDAO(order, 'orderId');
// keep add method to use later
var add = orderDAO.add;

// override add mthods of order
orderDAO.add = function(modelRequest, cb) {
	var newOrder = modelRequest;
	var reqItems = newOrder.items || [];
	var _this = this;
	newOrder.lastUpdateDate = moment().format('DD-MM-YYYY H:mm:ss');
	// var today = new 
	var searchFilter = {
		supplier: newOrder.supplier,
		orderDate: new RegExp('^' + moment().format('DD-MM-YYYY'), 'i')
	};
	var query = this.model.find(searchFilter);
	query.exec(function(err, docs) {
		if (err) {
			cb(err);
		} else {
			if (docs.length > 0) {
				var order = docs[0];
				var newItems = [];
				var isNewItem = true;
				for (var i = 0; i < reqItems.length; i++) {
					isNewItem = true;
					for (var j = 0; j < order.items.length; j++) {
						if (order.items[j].product.equals(reqItems[i].product)) {
							isNewItem = false;
							break;
						}
					}
					if (isNewItem) {
						newItems.push(reqItems[i]);
					}
				}
				order.items = newItems.concat(order.items);
				order.lastUpdateDate = moment().format('DD-MM-YYYY H:mm:ss');
				_this.update(order, cb);
			} else {
				newOrder.orderDate = moment().format('DD-MM-YYYY H:mm:ss');
				add(newOrder, cb);
			}
		}
	});
};

module.exports = orderDAO;