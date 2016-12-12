var fs = require('fs'),
	path = require('path'),
	Constants = require('../common/Constants');

const configFile = path.resolve('./service/src/config/appConfig.json');

try {
	// load application config properties
	var appConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));

	var prodConfig = appConfig.filter(function (config) {
		return config.env === Constants.PROD1_ENV;
	})[0];
	var devConfig = appConfig.filter(function (config) {
		return config.env === Constants.DEV1_ENV;
	})[0];

} catch (err) {
	console.error('Error reading config file - ' + configFile);
	process.exit(1);
}

exports.getLogConfig = function (env) {

	var obj = null;
	if (env === Constants.DEV1_ENV) {
		obj = devConfig.logging;
	} else if (env === Constants.PROD1_ENV) {
		obj = prodConfig.logging;
	}
	return obj;
}

exports.getDBConfig = function (env) {
	var obj = null;
	if (env === Constants.DEV1_ENV) {
		obj = devConfig.db;
	} else if (env === Constants.PROD1_ENV) {
		obj = prodConfig.db;
	}
	return obj;
}

exports.getAppPort = function (env) {
	var obj = null;
	if (env === Constants.DEV1_ENV) {
		obj = devConfig.port;
	} else if (env === Constants.PROD1_ENV) {
		obj = prodConfig.port;
	}
	return obj;
}