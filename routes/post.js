var User = require(global.MODEL_PATH + '/user');
var inherit = require('inherit');


module.exports = inherit({}, {

    'all /index' : function (req, res) {
        var params = '\n';

        for (var key in  req.headers) {
            params += (key + ' : ' + req.headers[key] + '\n');
        }


        res.render('post', {
            content : params
        });
    }
});