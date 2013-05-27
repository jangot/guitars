var fs = require('fs');

module.exports = function (app) {
    this._app = app;
    this._routesFolder = './routes';
    this._routeIndicator = '_route';
}

var bad = {
    _app : null,
    _routesFolder : null,
    _routeIndicator : null,

    listen : function () {
        var routersFiles = fs.readdirSync(this._routesFolder);
        for (var name in routersFiles) {

            var fileName = routersFiles[name];

            var RE = new RegExp(this._routeIndicator + '.js$');
            if (RE.test(fileName)) {
                var routeName =  fileName.split(RE)[0];
                var route = require(this._routesFolder + '/' + routeName + this._routeIndicator);


                for (var j in route) {

                    var method = route[j][0];

                    var params = route[j];
                    params.splice(0, 1);
                    params[0] = '/' + routeName + params[0];
                    this._app[method].apply(this._app, params);
                }

            }
        }
        return this;
    },

    setFolder : function(folder) {
        this._routesFolder = folder;
        return this;
    },

    setIndicator : function(indicator) {
        this._routeIndicator = indicator;
        return this;
    }
}

module.exports.prototype = {
    _app : null,
    _acl : null,
    _routesFolder : null,
    _routeIndicator : null,

    listen : function () {
        var routersFiles = fs.readdirSync(this._routesFolder);
        for (var name in routersFiles) {

            var fileName = routersFiles[name];

            var RE = new RegExp(this._routeIndicator + '.js$');
            if (RE.test(fileName)) {
                var routeName =  fileName.split(RE)[0];
                var route = require(this._routesFolder + '/' + routeName + this._routeIndicator);
                this._addRouter(routeName, route);
            }
        }
        return this;
    },

    setFolder : function(folder) {
        this._routesFolder = folder;
        return this;
    },

    setIndicator : function(indicator) {
        this._routeIndicator = indicator;
        return this;
    },

    setAcl : function (acl) {
        this._acl = acl;
        return this;
    },

    _addRouter : function(name, route) {
        for (var actionName in route) {
            var type = actionName.split(' ')[0];
            var url = actionName.split(' ')[1];
            var params = actionName.split(' ')[2];

            var methods = [];
            switch (type) {
                case 'get':
                case 'post':
                    methods.push(type);
                    break;
                case 'all':
                    methods.push('post');
                    methods.push('get');
            }
            if (methods.length > 0) {
                var path = '/' + name + url;
                for(var i in methods) {
                    if (params != 'open') {
                        this._setActionWithAcl(methods[i], path, route[actionName].bind(route));
                    } else {
                        this._setActionsWithoutAcl(methods[i], path, route[actionName].bind(route));
                    }
                }
            }
        }
        return this;
    },

    _setActionWithAcl : function (method, path, route) {
        this._app[method](path, require('./loadUser'), route);
    },

    _setActionsWithoutAcl : function (method, path, route) {
        this._app[method](path, route);
    }
}

