//var jade = require('jade');


module.exports = global.Class({}, {


    'get /add' : function (req, res){



        res.render('product/add', {
            title : 'Add guitar:',
            brands : {
                first: 'aaaa',
                second : 'bbbbb'
            }
        });
    },

    'post /add' : function (){

    }
});
