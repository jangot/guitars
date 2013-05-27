/**
 * Module dependencies.
 */

global.Class = require('inherit');
require('./constants/global');

global.register = require(global.LIB_PATH + '/register');

var bootstrap = require('./bootstrap');
bootstrap.run();


