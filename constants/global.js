function define(name, value) {
    Object.defineProperty(global, name, {
        value:      value,
        enumerable:   true,
        writable:     false,
        configurable: false
    });
}

var constants = {
    VIEWS_PATH : __dirname + '/../views',
    LIB_PATH : __dirname + '/../lib',
    MODEL_PATH : __dirname + '/../model',
    ACL_RESOURCES : [
        'content',
        'admin_panel'
    ],
    ACL_ROLES : {
        GUEST : 'guest',
            ADMIN : 'admin'
    },
    DB_TABLE_GUITAR : 'guitar',
    DB_TABLE_USER : 'user'
}

for (var constant in constants) {
    define(constant, constants[constant]);
}


