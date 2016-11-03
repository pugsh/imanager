//Dependencies
var mongoose = require('mongoose'),
	Operator = require('./QueryOperator');

// define sequence schema
var SequenceSchema = new mongoose.Schema({
	name: String,
	seq: {
		type: Number,
		default: 0
	}
}, {
		_id: false,
		versionKey: false
	});

// sequence model
var Sequence = mongoose.model('sequence', SequenceSchema);

// base dao for common db operations
var BaseDAO = function (modelObj, keyName) {
	if (modelObj === undefined || keyName === undefined) {
		throw "Model or Key is undifined.";
	}

	var _this = this;
	this.model = modelObj;
	this.key = keyName;

	//find document by id
	this.findById = function (id, expands, cb) {
		var query = _this.model.find({})
			.where(_this.key).equals(id);

		if (expands) {
			expands = expands.split(',');
			for (var i = 0; i < expands.length; i++) {
				query.populate(expands[i]);
			}
		}
		query.exec(function (err, docs) {
			if (err) {
				cb(err);
			} else {
				cb(null, docs);
			}
		});
	};

	//find all documents
	this.find = function (filterObj, cb) {
		var qbuilder = this.parseFilter(filterObj);
		var query = this.model.find(qbuilder.filter);

		if (qbuilder.expands) {
			for (var i = 0; i < qbuilder.expands.length; i++) {
				query.populate(qbuilder.expands[i]);
			}
		}

		query.exec(function (err, docs) {
			if (err) {
				cb(err);
			} else {
				cb(null, docs);
			}
		});
	};

	// function to create new model
	this.add = function (modelRequest, cb) {
		_this.getNextSequence(function (err, seq) {
			if (err) {
				cb(err);
			}
			modelRequest[_this.key] = seq;
			var addmodel = new _this.model(modelRequest);
			addmodel.save(function (err) {
				if (err) {
					cb(err);
				} else {
					cb();
				}
			});
		});
	};

	// function to update model
	this.update = function (modelRequest, cb) {
		var conditions = {},
			update = modelRequest,
			options = {
				upsert: true
			};

		conditions[_this.key] = modelRequest[_this.key];
		_this.preUpdate(modelRequest);
		_this.model.update(conditions, update, options, function (err, numAffected) {
			_this.postUpdate();
			if (err) {
				cb(err);
			} else {
				cb();
			}
		});
	};

	// function to delete a model
	this.remove = function (deleteId, cb) {
		var conditions = {};
		conditions[_this.key] = deleteId;

		_this.model.remove(conditions, function (err) {
			if (err) {
				cb(err);
			} else {
				cb();
			}
		});
	};

	this.getNextSequence = function (cb) {
		Sequence.findOneAndUpdate({
			name: _this.key
		}, {
				$inc: {
					seq: 1
				}
			}, {
				new: true,
				upsert: true
			}, function (err, doc) {
				if (err) {
					cb(err);
				}
				cb(null, doc.seq);
			});
	};

	this.parseFilter = function (filterObj) {
		var queryBuilder = {
			filter: {}
		},
			filter = {},
			selector = {};
		var parts, op, operator, prop, value;
		var strings, firstSpace;

		if (filterObj && filterObj.expands) {
			queryBuilder.expands = filterObj.expands.trim().split(',');
		}

		if (filterObj === undefined || filterObj.queryString === undefined) {
			return queryBuilder;
		}

		if (filterObj.queryString.indexOf('$AND') > -1) {
			strings = filterObj.queryString.split('$AND');
		} else {
			strings = filterObj.queryString.split('$OR');
		}

		for (var i = 0; i < strings.length; i++) {
			parts = strings[i].trim();
			firstSpace = parts.indexOf(' ');
			prop = parts.substring(0, firstSpace);
			op = parts.substring(firstSpace + 1, firstSpace + 4);
			value = parts.substring(firstSpace + 5).trim();

			operator = Operator[op];
			if (operator === undefined) {
				throw 'Invalid query operator ' + op;
			}

			switch (operator) {
				case Operator.$IN:
					value = value.split(',');
					break;
				case Operator.$EQ:
					value = value;
					break;
			}

			selector[operator] = value;
			filter[prop] = selector;
		}

		queryBuilder.filter = filter;

		return queryBuilder;
	};

	// handler function before update
	this.preUpdate = function (modelRequest) {
		// override this function for specific behavior
	};
	// handler function after update
	this.postUpdate = function () {
		// override this function for specific behavior
	};
};

module.exports = BaseDAO;