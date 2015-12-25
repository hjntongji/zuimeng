var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');

var port = process.env.PORT || 3000;

var dbUrl = 'mongodb://localhost/zuimeng';
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
mongoose.connect(dbUrl);

var app = express();

// models loading
var models_path = __dirname + '/app/models';
var walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);

        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

app.set('views', './app/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'zuimeng',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'dist')));
require('./config/routes')(app);

if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    // mongoose.set('debug', true);
}

app.listen(port);
app.locals.moment = require('moment');

console.log('zuimeng started on port ' + port);
