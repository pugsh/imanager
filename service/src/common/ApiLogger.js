var winston = require('winston'),
	ConfigManager = require('../config/ConfigManager'),
	Constants = require('./Constants');

var logger = null;
var env = process.env.ENVIRONMENT;
var debug = process.env.DEBUG;
var console = process.env.CONSOLE;

//default environment is dev01
if (!env) {
	env = 'dev01';
}

var fileParam = ConfigManager.getLogConfig(env);
var consoleParam =
	{
		"colorize": true,
		"timestamp": true,
	};

if (debug === 'true') {
	fileParam.level = "debug";
	consoleParam.level = "debug";
} else {
	fileParam.level = "info";
	consoleParam.level = "info";
}

var consoleLogger = new (winston.transports.Console)(consoleParam);

var transports = [new (winston.transports.File)(fileParam)];

exports.getLogger = function () {
	if (logger) {
		return logger;
	}
	if (console === 'true') {
		transports.push(consoleLogger);
	}

	logger = new (winston.Logger)({
		transports: transports
	});

	return logger;
}