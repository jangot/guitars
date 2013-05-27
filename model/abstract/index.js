var db = require(global.LIB_PATH + '/db');
var Collection = require('../collection');

module.exports = global.Class({

    getCollection : function (config, cb) {
        var sql = config.getSql();

        var client = db.getClient();
        client.query(sql.toString(), function(error, result, fields) {
            if (error) {
                cb(error);
                return;
            }

            var collection = new Collection();

            for (var i in result) {
                this._addToCollection(result[i], collection, function () {
                    if(collection.length == result.length) {
                        cb(undefined, collection);
                    }
                })
            }
        }.bind(this));
    },

    _addToCollection : function (data, collection, cb) {
        var object = this._createObject(data);
        collection.add(data.id, object, cb);
    },

    _createObject : function (){

    }

});
