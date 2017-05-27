var redisUtils = require('./../services/redisUtils');
var Constants = require('./../constants');
var config = require('./../config');
var databaseUtils = require('./../services/databaseUtils');
var util = require('util');

module.exports = {
    viewProductsByCategory: function* (next) {
        var categoryId = this.params.categoryId;
        var categoryDetails = {};

        var queryString = "select p.*, u.email, u.phone from product p join user u on p.user_id = u.id where p.category_id = %s and p.status = %s";
        var query = util.format(queryString, categoryId, Constants.productStatus.ACTIVE);
        var productList = yield databaseUtils.executeQuery(query);

        var categoryList = yield redisUtils.getItem(Constants.redisDataKeys.CATEGORY_LIST);
        for(var i in categoryList) {
            if(categoryList[i].id == categoryId) {
                categoryDetails = categoryList[i];
                break;
            }
        }

        yield this.render("productList", {
            categoryDetails: categoryDetails,
            productList: productList
        })
    },

    addProduct: function* (next) {

    },

    viewProductsByUser: function* (next) {

    }
}
