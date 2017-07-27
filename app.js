// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var pug        = require('pug');
var moment     = require('moment');
var bodyparser = require('body-parser');
var path       = require('path')
var expressValidator = require('express-validator')
var app        = express();                 // define our app using express

var routes = require('./routes/index');       // the folder where we keep routing info

app.set('port', 8089);        // set our port
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// REGISTER OUR ROUTES -------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use('/', routes);


app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
    message: err.message,
    error: err
  });
});

// START THE SERVER
// =============================================================================
//Debug start: SET DEBUG=event-attendance:* & npm run devstart
// =============================================================================
app.listen(app.get('port'));
console.log('Magic happens on port ' + app.get('port'));