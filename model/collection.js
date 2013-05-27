var inherit = require('inherit');

module.exports = inherit({

    _list : null,
    length : null,

    __constructor : function() {
        this._list = {};
        this.length = 0;
    },

    add : function (id, ob, cb) {
        if (!id) {
            cb(Error('You try to add object without params to collection.'));
            return;
        }
        if (!ob) {
            cb(Error('You try to missing object to collection.'));
            return;
        }

        this._list[id] = ob;
        this.length++;

        cb(undefined);
        return this;
    },

    getById : function (id, cb) {
        if (!this._list[id]) {
            cb(Error('Object with id "'+ id +'" not found.'))
            return;
        }
        cb(undefined, this._list[id]);
        return this;
    },

    toString : function (){
        return JSON.stringify(this._list);
    }

});
