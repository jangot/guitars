var User = require(global.MODEL_PATH + '/user');
var inherit = require('inherit');

module.exports = inherit({}, {

    'get ' : function (req, res) {

        res.render('index', {
            title: 'Express!',
            id : 'sdfsdfsd'//global.register.getLang().get('test')
        });
    },

    'get /demo' : function (req, res){
        var GuitarService = require(global.MODEL_PATH + '/guitar');
        var service = new GuitarService();
        var config = service.getConfig();
        config
            .addId(1)
            .addId(2)
        ;
        service.getCollection(config, function (e, collection) {
            if (e) {
                console.log('error');
            }
            collection.getById(1, function (error, result) {
                res.render('index/index', {
                    title: 'Demo page',
                    id : result.getId(),
                    content : result
                });
            });

        });
    },

    _first : function (req, res) {
        return 'test';
    }

});
