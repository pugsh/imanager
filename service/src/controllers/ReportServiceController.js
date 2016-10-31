//Dependencies
var router = require('express').Router(),
	logger = require('../common/ApiLogger'),
	printer = require('../util/PrintOrder');

var downloadReport = function(req, res, next) {
	var date = req.query.date;
	printer.createReport(date, function(err, report) {
		if (err) {
			logger.error('Eror generating report.', err);
			res.send('Failed generate report. Try again after some time.');
		} else {
			res.download(report);
		}
	});
};

var streamReport = function(req, res, next) {
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
router.get('/order', streamReport);
router.get('/order/download', downloadReport);

module.exports = router;