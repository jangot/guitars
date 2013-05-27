var userLoader = require(global.LIB_PATH + '/loadUser');

module.exports = [

    [
        'get',
        '/',
        userLoader,
        function (req, res) {

            res.render('index', {
                title: 'Express!',
                id : 'sdfsdfsd'//global.register.getLang().get('test')
            });
        }
    ],

    [
        'get',
        '/demo',
        userLoader,
        function (req, res){
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
        }
    ]

];
