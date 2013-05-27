module.exports = {

    _register : null,

    run : function (){
        this
            ._initRegister()
            ._initAcl()
            ._initApplicationConfig()
            ._initApp()
            ._initLang()
            ._initRoutes()
            ._createServer()
        ;
    },

    _initRegister : function (){
        global.register = require(global.LIB_PATH + '/register');
        this._register = global.register;
        return this;
    },

    _initAcl : function (){
        var Acl = require('acl');

        var acl = new Acl(new Acl.memoryBackend());

        acl.allow('root', 'blogs', '*', function () {
            acl.addUserRoles('jangot', 'root', function () {
                console.log('Acl ok');
            });
        });

        this._register.setAcl(acl);
        return this;
    },

    _initApplicationConfig : function (){
        this._register.setConfig(require(__dirname + '/conf/application'));
        return this;
    },

    _initApp : function (){
        var express = require('express');
        var http = require('http');
        var path = require('path');


        var app = express();
        app.configure(function(){
            app.set('port', 3000);
            app.set('views', global.VIEWS_PATH);
            app.set('view engine', 'jade');
            app.use(express.favicon());
            app.use(express.logger('dev'));
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(express.cookieParser('101010'));
            app.use(express.session());
            app.use(app.router);
            app.use(express.static(path.join(__dirname, 'public')));
        });

        app.configure('development', function(){
            app.use(express.errorHandler());
        });

        this._register.setApplication(app);

        return this;
    },

    _initLang : function (){
        var Lang = require(global.LIB_PATH + '/lang');

        var lang = new Lang();
        lang.addList(require('./langs/ru'));


        this._register.setLang(Lang);
        return this;
    },

    _initRoutes : function (){
        var Router = require(global.LIB_PATH + '/routesLoader');

        var app = global.register.getApplication();
        var routes = new Router(app);
        routes
            .setFolder(__dirname + '/routes')
            .setIndicator('')
            .listen()
        ;
        return this;
    },

    _createServer : function (){
        var http = require('http');
        var app = global.register.getApplication();

        http.createServer(app).listen(app.get('port'), function(){
            console.log("Express server listening on port " + app.get('port'));
        });
        return this;
    }

}
