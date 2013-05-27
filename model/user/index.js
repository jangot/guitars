var AbstractIndex = require('../abstract/index');
var db = require(global.LIB_PATH + '/db');

module.exports = global.Class(AbstractIndex, {

    getConfig : function () {
        var Config = require('./selectBuilder');
        return new Config();
    },

    auth : function (login, password, callback){
        if (!callback) {
            callback = function(result) {
                console.log('Auth: ' + result);
            };
        }
        var client = db.getClient();

        var query = "SELECT * FROM user WHERE name = '" + login + "' AND pass = '" + password + "'";
        client.query(query, function(error, result, fields) {
            if (error || !result.length) {
                callback(true);
                return;
            }
            callback(false, result[0].id);
        }.bind(this));
    },

    _createObject : function (objectData) {
        var User = require('./object');
        return new User(objectData);
    }

});