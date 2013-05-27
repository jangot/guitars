var inherit = require('inherit');

module.exports = inherit({

    _list : null,

    __constructor : function() {
        this._list = {};
    },

    addList : function (list) {
        if (typeof list != 'object') {
            return this;
        }
        for (var key in list) {
            this._list[key] = list[key];
        }
    },

    get : function (key) {
        if (this._list[key]) {
            return this._list[key];
        }
        return key;
    }

});
