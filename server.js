'use strict';

var express  = require('express'),
	compress = require('compression'),
	morgan   = require('morgan'),
	path     = require('path'),
	config   = require('./config.js');

var app = express();
var currentPath = path.join(__dirname, 'dist');

app.use(compress());
app.use(morgan('tiny'));
app.use(express.static(currentPath));

app.get('*', function(req, res) {
	res.sendFile(path.join(currentPath, 'index.html'))
});

app.listen(+config.port);
console.log('Listening on port ' + +config.port + '!');
