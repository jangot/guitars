var AbstractObject = require('../abstract/object');

module.exports = global.Class(AbstractObject, {

    _getDataConstructor : function (){
        return require('./data');
    }

});
