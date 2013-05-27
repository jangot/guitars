var inherit = require('inherit');

var
    SETTINGS_CONFIG = 'config',
    SETTINGS_ACL = 'acl',
    SETTINGS_LANG = 'lang',
    APPLICATION = 'app'
;

module.exports = inherit({}, {

    _options : {},

    setOption : function(name, option) {
        this._options[name] = option;
    },

    getOption : function(name) {
        return this._options[name] || null;
    },

    setConfig : function(config) {
        this.setOption(SETTINGS_CONFIG, config);
        return this;
    },

    getConfig : function() {
        return this.getOption(SETTINGS_CONFIG);
    },

    setAcl : function(acl) {
        this.setOption(SETTINGS_ACL, acl);
        return this;
    },

    getAcl : function() {
        return this.getOption(SETTINGS_ACL);
    },

    setLang : function (lang) {
        this.setOption(SETTINGS_LANG, lang);
        return this;
    },

    getLang : function () {
        return this.getOption(SETTINGS_LANG);
    },

    setApplication : function (application){
        this.setOption(APPLICATION, application);
        return this;
    },

    getApplication : function (){
        return this.getOption(APPLICATION);
    }


});
