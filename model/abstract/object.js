module.exports = global.Class({

    _data : null,

    __constructor : function(data) {
        var Data = this._getDataConstructor();
        this._data = new Data(data);
    },

    getId : function () {
        return this._data.getId();
    },

    toString : function (){
        return this._data.toString();
    },

    _getDataConstructor : function (){
        return require('./data');
    }
});
