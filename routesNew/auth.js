var User = require(global.MODEL_PATH + '/user');

var authPage = '/auth';
var startPage = '/product/add';

module.exports = [

    [
        'get',
        '',
        function (req, res){
            res.render('auth/form', {
                title : 'Auth form:'
            });
        }
    ],

    [
        'post',
        '/login',
        function (req, res) {
            var user = new User();
            user.auth(req.body.login, req.body.pass, function(e, userId) {
                if (e) {
                    res.redirect(authPage);
                    return;
                }

                req.session.user_id = userId;
                res.redirect(startPage)

            }.bind(this));
        }
    ],

    [
        'get',
        '/logout',
        function (){
            req.session.user_id = false;
            res.redirect(authPage);
        }
    ]

];
