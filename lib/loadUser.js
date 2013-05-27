module.exports = function loadUser(req, res, next) {
    if (req.session.user_id) {

        var UserService = require(global.MODEL_PATH + '/user');
        var service = new UserService();
        var config = service.getConfig();
        config
            .addId(req.session.user_id)
        ;
        service.getCollection(config, function (e, collection) {
            if (e) {
                console.log('error');
            }

            collection.getById(req.session.user_id, function (error, result) {
                if (error) {
                    res.redirect('/auth');
                }

                next();
            });
        });

    } else {
        res.redirect('/auth');
    }
}