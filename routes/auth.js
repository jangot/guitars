var User = require(global.MODEL_PATH + '/user');
var inherit = require('inherit');

module.exports = inherit({}, {

    _authPage : '/auth',
    _startPage : '/product/add',

    'get  open' : function (req, res){
        res.render('auth/form', {
            title : 'Auth form:'
        });
    },

    'post /login open' : function (req, res) {
        var user = new User();
        user.auth(req.body.login, req.body.pass, function(e, userId) {
            if (e) {
                res.redirect(this._authPage);
                return;
            }

            req.session.user_id = userId;
            res.redirect(this._startPage)

        }.bind(this));
    },

    'all /logout open' : function (req, res){
        req.session.user_id = false;
        res.redirect(this._authPage);
    }
});
