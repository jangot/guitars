var AbstractSelectBuilder = require('../abstract/selectBuilder');

module.exports = global.Class(AbstractSelectBuilder, {

    getSql : function () {
        var query = this._getSelect();
        query
            .select('user.id')
            .select('user.name')
            .from(global.DB_TABLE_USER + ' AS user')
        ;

        var where = '';
        for (var i = 0; i < this._ids.length; i++) {
            if (!where) {
                where = 'user.id' + ' = ' + this._ids[i];
            } else {
                where += ' OR user.id' + ' = ' + this._ids[i];
            }
        }

        query.where(where);

        var result = query.toString();

        return result;
    }

});

