var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var conn = mongoose.connect('mongodb://127.0.0.1/bespokedb', {useMongoClient: true});
var expressionSession = require('express-session');
var mongoStore = require('connect-mongo') ({session: expressionSession});
require('./models/cart_model.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressionSession({
    secret: 'SECRET',
    saveUninitialized: false, // don't create session until something stored
    resave: false,
    cookie: {maxAge: 60*60*1000},
    store: new mongoStore({
        url: 'mongodb://127.0.0.1/bespokedb',
        collection: 'sessions'
    })
}));
require('./routes')(app);
app.listen(81);
