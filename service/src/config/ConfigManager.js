var fs = require('fs');

const configFile = './service/src/config/appConfig.json';

try {
	// load application config properties
	var appConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));

	var prodConfig = appConfig.filter(function(config) {
		return config.env === 'prod';
	});
	var devConfig = appConfig.filter(function(config) {
		return config.env === 'dev';
	});

} catch (err) {
	console.error('Error reading config file - ' + configFile);
	process.exit(1);
}

exports.prodConfig = prodConfig[0];
exports.devConfig = devConfig[0];

exports.devDBURL = devConfig[0].databases[0].url;
exports.prodDBURL = prodConfig[0].databases[0].url;

exports.logParams = devConfig[0].logging;