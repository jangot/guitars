

module.exports = global.Class({

    _ids : null,

    __constructor : function() {
        this._ids = [];
    },

    addId : function (id) {
        this._ids.push(id);
        return this;
    },

    getSql : function (){
        throw Error('This is abstract method of "SelectBuilder"');
    },

    _getSelect : function (){
        var Select = require('sql-builder').select;
        return new Select();
    }

});
