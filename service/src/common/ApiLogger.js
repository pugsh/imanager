var winston = require('winston'),
	applicationProps = require('../config/ConfigManager');

var logConfig = applicationProps.logParams;

// configure new api logger
var logger = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)({
			"level": "debug",
			"colorize": true,
			"timestamp": true,
		}),
		new(winston.transports.File)(logConfig)
	]
});

module.exports = logger;