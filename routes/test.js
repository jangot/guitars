var inherit = require('inherit');

module.exports = inherit({}, {

    'get ' : function (req, res) {
        res.render('index', {
            title: 'First!',
            id : 1111
        })
    }

});