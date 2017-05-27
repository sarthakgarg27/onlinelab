var app = require('koa')();

var koaRouter = require('koa-router');
var cors = require('koa-cors');
var mount = require('koa-mount');

var render = require('co-ejs');
var path = require('path');
var Constants = require('./constants');

var config = require('./config');
var logger = require('./logger');

var redisUtils = require('./services/redisUtils');
var sessionUtils = require('./services/sessionUtils');

var http = require('http');
var https = require('https');
var fs = require('fs');

app.use(cors({
    origin: function (req) {
      return '*';
    },
    allowMethods: ['GET', 'POST']
}));

app.use(function* (next) {
    var sessionId = this.cookies.get("SESSION_ID");
    this.currentUser = yield sessionUtils.getCurrentUser(sessionId);
    var locals = {
        currentUser: this.currentUser,
        title: "Mini OLX - Bech de",
        utils: require('./ejsHelpers'),
        enableGoogleAnalyticsTracking: config.enableGoogleAnalyticsTracking
    };

    render(app, {
      root: path.join(__dirname, 'views'),
      layout: false,
      viewExt: 'html',
      cache: false,
      locals: locals,
      debug: false
    });
    yield next;
});

app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    this.type = 'json';
    logger.logError(err);
    this.status = err.status || 500;
    this.body = {'error': 'Some error occured'};
    this.app.emit('error', err, this);
  }
});

app.use(mount('/app', require('./routes/appRoutes')(app)));

var serve = require('koa-static');
app.use(serve('static'));

module.exports = app;

require('./clusterify')(app);
