var databaseUtils = require('./services/databaseUtils');
var redisUtils = require('./services/redisUtils');
var logger = require('./logger');
var Constants = require('./constants');
var fs = require('fs');

function storeCategoriesListInRedis() {
    var query = "select * from category";
    databaseUtils.executePlainQuery(query, function(err, response) {
        if(err) {
            logger.logError(err);
        } else {
            redisUtils.setItem(Constants.redisDataKeys.CATEGORY_LIST, JSON.stringify(response));
        }
    })
}

storeCategoriesListInRedis();