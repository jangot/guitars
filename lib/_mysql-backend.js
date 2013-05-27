var Select = require('sql-builder').select;
var Insert = require('sql-builder').insert;
var Delete = require('sql-builder').delete;

/**
	Redis Backend.
	
  Implementation of the storage backend using Redis
*/
var Client = require('mysql').createConnection;
var contract = require('contract');

const TABLE_NAME = 'acl';
const COLL_NAME_KEY = 'key';
const COLL_NAME_VALUE = 'value';

function noop(){};

function MysqlBackend(){
}

MysqlBackend.prototype = {
  
  /**  
     Begins a transaction
  */
  begin : function(){
    return this._getClient();
  },

    _getClient : function() {
        var db = this._getConfig().db;

        var client = Client({
            host     : db.host,
            user     : db.login,
            password : db.password
        });

        client.connect();
        client.query('USE ' + db.name);

        return client;
    },

    _getConfig : function() {
        return global.register.getConfig();
    },
  
  /**
     Ends a transaction (and executes it)
  */
  end : function(transaction, cb){
        contract(arguments).params('object', 'function').end();
      transaction.end();
      cb();
  },
  
  /**
    Cleans the whole storage.
  */
  clean : function(cb){
    contract(arguments).params('function').end();
    var query = 'TRUNCATE TABLE ' + TABLE_NAME;
      this._query(query, cb);
  },
  
  /**
     Gets the contents at the bucket's key.
  */
  get : function(bucket, key, cb){
		contract(arguments)
	      .params('string', 'string', 'function')
	      .end();

    key = this.bucketKey(bucket, key);

      var query = new Select();
      query
        .select(COLL_NAME_VALUE)
        .from(TABLE_NAME + ' AS t')
        .where('t.' + COLL_NAME_KEY + '="' + key + '"')
      ;
    this._query(query.toString(), function (result) {
        cb([]);
    });
  },
  
	/**
		Returns the union of the values in the given keys.
	*/
	union : function(bucket, keys, cb){
		contract(arguments)
	      .params('string', 'array', 'function')
	      .end();
    
    keys = this.bucketKey(bucket, keys);

	},
  
	/**
		Adds values to a given key inside a bucket.
	*/
	add : function(transaction, bucket, key, values){
		contract(arguments)
	      .params('object', 'string', 'string','string|array')
        .end();
            
    key = this.bucketKey(bucket, key);
            
    if (Array.isArray(values)){
      values.forEach(function(value){
        transaction.sadd(key, value);
      });
    }else{
      transaction.sadd(key, values);
    }
	},
  
  /**
     Delete the given key(s) at the bucket
  */
  del : function(transaction, bucket, keys){
		contract(arguments)
	      .params('object', 'string', 'string|array')
	      .end();
            
    var self = this;
    
    keys = Array.isArray(keys) ? keys : [keys]
    
    keys = keys.map(function(key){
      return self.bucketKey(bucket, key);
    });
  
    transaction.del(keys);
  },
  
	/**
		Removes values from a given key inside a bucket.
	*/
	remove : function(transaction, bucket, key, values){
		contract(arguments)
	      .params('object', 'string', 'string','string|array')
        .end();
                  
    key = this.bucketKey(bucket, key);
        
    if (Array.isArray(values)){
      values.forEach(function(value){
        transaction.srem(key, value);
      });
    }else{
      transaction.srem(key, values);
    }
  },
  
  //
  // Private methods
  //
    
  bucketKey : function(bucket, keys){
    var self = this;
    if(Array.isArray(keys)){
      return keys.map(function(key){
        return bucket+'@'+key;
      });
    }else{
      return bucket+'@'+keys;
    }
  },

  _query : function (query, cb) {
      var self = this;

      var transaction = this.begin();
      transaction.query(query, function(error, result, fields) {
          if (error) {
              cb(false);
              return;
          }
          cb(result);

          self.end(transaction, function () {});
      });

  }
}

exports = module.exports = RedisBackend;
