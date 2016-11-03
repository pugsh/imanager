//Dependencies
var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	applicationProps = require('./service/src/config/Configmanager'),
	mongoose = require('mongoose'),
	logger = require('./service/src/common/ApiLogger'),
	securityFilter = require('./service/src/common/middlewares/SecurityFilter');

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

mongoose.connect(applicationProps.devDBURL)
	.then(() => {
		app.listen(3000, () => (logger.info('API is running on port 3000')));
	})
	.catch((err) => {
		logger.err(err.toString());
		process.exit(1);
	});