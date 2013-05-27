var inherit = require('inherit');

module.exports = inherit({

    id : null,

    __constructor : function (data){
        this
            ._checkData(data)
            ._setData(data)
        ;
    },

    getId : function (){
        return this.getParam('id');
    },

    getParam : function (name){
        return this[name];
    },

    toString : function (){
        var result = {};
        for (var name in this) {
            if (typeof this[name] !== 'function') {
                result[name] = this[name];
            }
        }
        return JSON.stringify(result);
    },

    _checkData : function (data){
        if (!data) {
            throw Error('There is\'t data');
        }
        return this;
    },

    _setData : function (data){
        for (var name in this) {
            if (typeof this[name] !== 'function' && data[name] !== undefined) {
                this[name] = data[name];
            }
        }
        return this;
    }

});
