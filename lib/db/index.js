var Client = require('mysql').createConnection;

module.exports = {
    getClient : function() {
        var db = this._getConfig().db;

        var client = Client({
            host     : db.host,
            user     : db.login,
            password : db.password
        });

        client.connect();
        client.query('USE ' + db.name);

        return client;
    },

    _getConfig : function() {
        return global.register.getConfig();
    }

}
