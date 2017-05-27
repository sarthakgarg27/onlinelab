var sessionUtils = require('./../services/sessionUtils');
var Constants = require('./../constants');
var config = require('./../config');
var databaseUtils = require('./../services/databaseUtils');
var redisUtils = require('./../services/redisUtils');
var util = require('util');

module.exports = {
    showLoginPage: function* (next) {
        var errorMessage;
        yield this.render('login', {
            errorMessage: errorMessage
        });
    },

    showSignupPage: function* (next) {
        var errorMessage;
        yield this.render('signup', {
            errorMessage: errorMessage
        });
    },

    showHomePage: function* (next){
        var categoryList = yield redisUtils.getItem(Constants.redisDataKeys.CATEGORY_LIST);
        yield this.render('home', {
            categoryList: categoryList
        });
    },

    login: function* (next) {
        var email = this.request.body.email;
        var password = this.request.body.password;

        var queryString = "select * from user where email = '%s' and password = '%s'";
        var query = util.format(queryString, email, password);
        var results = yield databaseUtils.executeQuery(query);

        var errorMessage;
        if(results.length == 0) {
            errorMessage = "Incorrect user credentials";
            yield this.render('login', {
                errorMessage: errorMessage
            });
        } else {
            var redirectUrl = "/app/home";
            sessionUtils.saveUserInSession(results[0], this.cookies);
            this.redirect(redirectUrl);
        }
    },

    signup: function* (next) {

    },

    logout: function* (next) {
        var sessionId = this.cookies.get("SESSION_ID");
        if(sessionId) {
            sessionUtils.deleteSession(sessionId);
        }
        this.cookies.set("SESSION_ID", '', {expires: new Date(1), path: '/'});
        this.redirect('/');
    }
}
