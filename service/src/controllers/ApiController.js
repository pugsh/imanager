//Dependencies
var express = require('express'),
	router = express.Router(),
	logger = require('../common/ApiLogger'),
	ModelType = require('../models/ModelType'),
	ResponseBuilder = require('./Response');

var get = function(req, res, next) {
	var modelName = req.params.modelType,
		model = ModelType[modelName],
		OperationResult;

	if (model === undefined) {
		logger.error('Unknown model type. ModelType %s', modelName);
		OperationResult = new ResponseBuilder.buildErrorResponse('Model type is unknown ' + modelName);
		res.send(OperationResult);
	} else {
		var filterObj = {
			queryString: req.query.$filter,
			expands: req.query.$expands
		};

		model.find(filterObj, function(err, docs) {
			var OperationResult;
			if (err) {
				OperationResult = new ResponseBuilder.buildErrorResponse(err.toString());
				logger.error('Exception occured while fetching model %s', modelName, err);
			} else {
				OperationResult = new ResponseBuilder.buildSuccessResponse(docs);
				logger.info('Successfully fetched model %s', modelName);
			}
			res.send(OperationResult);
		});
	}
};

var getById = function(req, res, next) {

	var modelName = req.params.modelType,
		model = ModelType[modelName],
		id = req.params.id,
		OperationResult;

	if (model === undefined) {
		logger.error('Unknown model type. ModelType %s', modelName);
		OperationResult = new ResponseBuilder.buildErrorResponse('Model type is unknown ' + modelName);
		res.send(OperationResult);
	} else {
		var expands = req.query.$expands;
		model.findById(id, expands, function(err, docs) {
			if (err) {
				OperationResult = new ResponseBuilder.buildErrorResponse(err.toString());
				logger.error('Exception occured while fetching model %s', modelName, err);
			} else {
				OperationResult = new ResponseBuilder.buildSuccessResponse(docs);
				logger.info('Successfully fetched model %s', modelName, id);
			}
			res.send(OperationResult);
		});
	}
};

var create = function(req, res, next) {
	var modelRequest = req.body,
		modelName = req.params.modelType,
		model = ModelType[modelName],
		OperationResult;

	if (model === undefined) {
		logger.error('Unknown model type. ModelType %s', modelName);
		OperationResult = new ResponseBuilder.buildErrorResponse('Model type is unknown ' + modelName);
		res.send(OperationResult);
	} else {
		model.add(modelRequest, function(err) {
			if (err) {
				OperationResult = new ResponseBuilder.buildErrorResponse(err.toString());
				logger.error('Error creating model %s', modelName, modelRequest);
			} else {
				OperationResult = new ResponseBuilder.buildSuccessResponse();
				logger.info('Successfully created model %s', modelName, modelRequest);
			}
			res.send(OperationResult);
		});
	}
};

var update = function(req, res, next) {
	var modelRequest = req.body,
		modelName = req.params.modelType,
		model = ModelType[modelName],
		OperationResult;

	if (model === undefined) {
		logger.error('Unknown model type. ModelType %s', modelName);
		OperationResult = new ResponseBuilder.buildErrorResponse('Model type is unknown ' + modelName);
		res.send(OperationResult);
	} else {
		model.update(modelRequest, function(err) {
			if (err) {
				OperationResult = new ResponseBuilder.buildErrorResponse(err.toString());
				logger.error('Error updating model %s', modelName, modelRequest);
			} else {
				OperationResult = new ResponseBuilder.buildSuccessResponse();
				logger.info('Successfully updated model %s', modelName, modelRequest);
			}
			res.send(OperationResult);
		});
	}
};

var remove = function(req, res, next) {
	var deleteReq = req.body,
		modelName = req.params.modelType,
		model = ModelType[modelName],
		OperationResult;

	if (model === undefined) {
		logger.error('Unknown model type. ModelType %s', modelName);
		OperationResult = new ResponseBuilder.buildErrorResponse('Model type is unknown ' + modelName);
		res.send(OperationResult);
	} else {
		model.remove(deleteReq.id, function(err) {
			if (err) {
				OperationResult = new ResponseBuilder.buildErrorResponse(err.toString());
				logger.error('Error deleting model %s', modelName, deleteReq);
			} else {
				OperationResult = new ResponseBuilder.buildSuccessResponse();
				logger.info('Successfully deleted model %s', modelName, deleteReq);
			}
			res.send(OperationResult);
		});
	}
};

// publish endpoints
router.get('/:modelType/', get);
router.get('/:modelType/:id', getById);
router.post('/:modelType/create', create);
router.put('/:modelType/update', update);
router.post('/:modelType/remove', remove);

module.exports = router;