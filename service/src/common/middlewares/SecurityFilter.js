//Dependencies
var logger = require('../ApiLogger');

var urlPattern = new RegExp('(\/imanager)(\/view\/)\w(\.html)');
/* common security filter applied to all incoming
and outgoing request. */
var securityFilter = function(req, res, next) {
	logger.info('request received. ' + req.url);
	next();
};

module.exports = securityFilter;