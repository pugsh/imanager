//Dependencies
var router = require('express').Router(),
	logger = require('../common/ApiLogger'),
	printer = require('../util/PrintOrder');

var createOrderReport = function(req, res, next) {
	var date = req.query.date;
	printer.createReport(date, function(err, report) {
		if (err) {
			logger.error('Eror generating report.', err);
			res.send('Failed generate report. Try again after some time.');
		} else {
			res.sendFile(report);
		}
	});
};

// publish endpoints
router.get('/order', createOrderReport);

module.exports = router;