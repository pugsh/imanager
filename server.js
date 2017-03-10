//Dependencies
var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	mongoose = require('mongoose'),
	ConfigManager = require('./service/src/config/ConfigManager'),
	ApiLogger = require('./service/src/common/ApiLogger'),
	securityFilter = require('./service/src/middlewares/SecurityFilter');

var logger = ApiLogger.getLogger();

// Use native Node promises
mongoose.Promise = global.Promise;
// set root app directory
global.appRootDir = __dirname;

//Express
var app = express();

// attach middlewares
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use('/', securityFilter);

// cache expiration time for static resources
var oneYear = 31536000 * 1000;
//define static resource path
app.use('/imanager/static', express.static(path.join(__dirname + '/web/src/public/js'), { maxAge: oneYear }));
app.use('/imanager/static', express.static(path.join(__dirname + '/web/src/public/css'), { maxAge: oneYear }));
app.use('/imanager/static', express.static(path.join(__dirname + '/web/src/public/lib'), { maxAge: oneYear }));
app.use('/imanager/static', express.static(path.join(__dirname + '/web/src/public/icon'), { maxAge: oneYear }));
app.use('/imanager/images', express.static(path.join(__dirname + '/web/src/public/images'), { maxAge: oneYear }));
app.use('/imanager/fonts', express.static(path.join(__dirname + '/web/src/public/fonts'), { maxAge: oneYear }));

//serve html file
app.use('/imanager/view', require('./service/src/controllers/WebController'));
//define routes
app.use('/imanager/api', require('./service/src/controllers/ApiController'));
// define route for utility service
app.use('/imanager/report', require('./service/src/controllers/ReportServiceController'));

var environment = process.env.ENVIRONMENT;
//default environment is dev01
if (!environment) {
	environment = 'dev01';
}
var appPort = ConfigManager.getAppPort(environment);
var dbConfig = ConfigManager.getDBConfig(environment);

if (appPort === null || dbConfig === null) {
	console.error('App port or database config is not defined.');
	process.exit(1);
}

mongoose.connect(dbConfig.url)
	.then(() => {
		app.listen(appPort, () => (logger.info('App is running on port ' + appPort)));
	})
	.catch((err) => {
		logger.error(err.toString());
		process.exit(1);
	});