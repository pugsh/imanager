//Dependencies
var express = require('express'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	path = require('path'),
	applicationProps = require('./service/src/config/Configmanager'),
	mongoose = require('mongoose'),
	logger = require('./service/src/common/ApiLogger'),
	securityFilter = require('./service/src/common/middlewares/SecurityFilter');

// Use native Node promises
mongoose.Promise = global.Promise;

//Express
var app = express();

// attach middlewares
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use('/', securityFilter);

//define static resource path
app.use('/imanager/static', express.static(path.join(__dirname + '/web/src/public/js')));
app.use('/imanager/static', express.static(path.join(__dirname + '/web/src/public/css')));
app.use('/imanager/static', express.static(path.join(__dirname + '/web/src/public/lib')));
app.use('/imanager/static', express.static(path.join(__dirname + '/web/src/public/icon')));
app.use('/imanager/images', express.static(path.join(__dirname + '/web/src/public/images')));
app.use('/imanager/fonts', express.static(path.join(__dirname + '/web/src/public/fonts')));

//serve html file
app.use('/imanager/view', require('./service/src/controllers/WebController'));
//define routes
app.use('/imanager/api', require('./service/src/controllers/ApiController'));

mongoose.connect(applicationProps.devDBURL)
	.then(() => {
		app.listen(3000, () => (logger.info('API is running on port 3000')));
	})
	.catch((err) => {
		logger.err(err.toString());
		process.exit(1);
	});