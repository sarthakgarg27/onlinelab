var Router= require('koa-router');
var bodyParser = require('koa-body')();

module.exports = function(app){

    var router = new Router();

    //Welcome Routes
    var welcomeCtrl = require('./../controllers/WelcomeCtrl');
    
    router.get('/login', welcomeCtrl.showLoginPage);
    router.post('/login', bodyParser, welcomeCtrl.login);
    router.get('/signup', welcomeCtrl.showSignupPage);
    router.post('/signup', bodyParser, welcomeCtrl.signup);
    router.get('/home', welcomeCtrl.showHomePage);
    router.get('/logout', welcomeCtrl.logout);

    //Product Routes
    var productCtrl = require('./../controllers/ProductCtrl');

    router.get('/:slug/ads/:categoryId', productCtrl.viewProductsByCategory);

    return router.middleware();
}
