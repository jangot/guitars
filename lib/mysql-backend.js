/**
  MySql Backend.
	
  In-memory implementation of the storage.
*/

var Select = require('sql-builder').select;
var Insert = require('sql-builder').insert;
var Delete = require('sql-builder').delete;
var Client = require('mysql').createConnection;

var contract = require('contract');
var _ = require('underscore');


const TABLE_NAME = 'acl_bucket';
const COLL_NAME_BUCKET = 'bucket';
const COLL_NAME_KEY = 'key';
const COLL_NAME_VALUE = 'value';

function MySqlBackend(){

};

MySqlBackend.prototype = {
  /**  
     Begins a transaction.
  */
  begin : function(){
    // returns a transaction object(just an array of functions will do here.)
    return [];
  },
  
  /**
     Ends a transaction (and executes it)
  */
  end : function(transaction, cb){
		contract(arguments).params('array', 'function').end();

      function runQuery(client, querys, cb) {
          if (querys.length) {
              client.query(querys[0], function (error, result) {
                  if(error) {
                      cb(error);
                      return;
                  }
                  querys.slice(0, 1);
                  runQuery(client, querys, cb);
              });
          } else {
              cb(undefined);
          }
      }

      var client = this._getClient();
    // Execute transaction

      runQuery(client, transaction, cb);
    //cb(undefined);
  },
  
  /**
    Cleans the whole storage.
  */
  clean : function(cb){
    contract(arguments).params('function').end();
      var query = 'TRUNCATE TABLE ' + TABLE_NAME;
      var client = this._getClient();
      client.query(query, function (error, result) {
          client.end();
          if (error) {
              cb(error);
              return;
          }
          cb(undefined, result);
      });
  },
  
  /**
     Gets the contents at the bucket's key.
  */
  get : function(bucket, key, cb){
		contract(arguments)
	      .params('string', 'string', 'function')
	      .end();

      var query = new Select();
      query
          .select(COLL_NAME_VALUE)
          .from(TABLE_NAME + ' AS t')
          .where('t.' + COLL_NAME_BUCKET + '="' + bucket + '"')
          .where('t.' + COLL_NAME_KEY + '="' + key + '"')
      ;
      var client = this._getClient();
      client.query(query.toString(), function (error, result) {
          client.end();
          if (error) {
              cb(error);
              return;
          }
          var values = [];
          for (var i in result) {
              values.push(result[i][COLL_NAME_VALUE])
          }
          cb(undefined, values);
      });
  },

	/**
		Returns the union of the values in the given keys.
	*/
  union : function(bucket, keys, cb){
    contract(arguments)
  	  .params('string', 'array', 'function')
  	  .end();

        var query = new Select();
        query
            .select(COLL_NAME_VALUE)
            .select(COLL_NAME_KEY)
            .from(TABLE_NAME + ' AS t')
            .where('t.' + COLL_NAME_BUCKET + '="' + bucket + '"')
        ;
        var client = this._getClient();
        client.query(query.toString(), function (error, result) {
            client.end();
            if (error) {
                cb(error);
                return;
            }
            var values = {};
            for (var i in result) {
                values[result[i][COLL_NAME_KEY]] = result[i][COLL_NAME_VALUE];
            }

            if(values){
                var keyArrays = [];
                for(var i=0,len=keys.length;i<len;i++){
                    if(values[keys[i]]){
                        keyArrays.push.apply(keyArrays, values[keys[i]]);
                    }
                }
                cb(undefined, _.union(keyArrays));
            }else{
                cb(undefined, []);
            }


        });


	},
  
  /**
		Adds values to a given key inside a bucket.
	*/
	add : function(transaction, bucket, key, values){
		contract(arguments)
	      .params('array', 'string', 'string','string|array')
        .end();
        
    values = makeArray(values);

      var query = new Insert();
      query.into(TABLE_NAME);

    transaction.push();

//    transaction.push(function(){
//      if(!self._buckets[bucket]){
//        self._buckets[bucket] = {};
//      }
//      if(!self._buckets[bucket][key]){
//        self._buckets[bucket][key] = values;
//      }else{
//        self._buckets[bucket][key] = _.union(values, self._buckets[bucket][key]);
//      }
//    })
	},
    
  /**
     Delete the given key(s) at the bucket
  */
  del : function(transaction, bucket, keys){
		contract(arguments)
	      .params('array', 'string', 'string|array')
	      .end();
        
    var self = this;
    keys = makeArray(keys);
    
    transaction.push(function(){
      if(self._buckets[bucket]){
        for(var i=0, len=keys.length;i<len;i++){
          delete self._buckets[bucket][keys[i]];
        }
      }
    })
  },
  
	/**
		Removes values from a given key inside a bucket.
	*/
	remove : function(transaction, bucket, key, values){
		contract(arguments)
	      .params('array', 'string', 'string','string|array')
        .end();
        
    var self = this;
    values = makeArray(values);
    transaction.push(function(){
      var old;
      if(self._buckets[bucket] && (old = self._buckets[bucket][key])){
        self._buckets[bucket][key] = _.difference(old, values);
      }
    });
	},

    _query : function (client, query, cb) {
        var self = this;

        //var client = this._getClient();
        client.query(query, function(error, result, fields) {
            cb(error, result);
        });

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
    }
}

function makeArray(arr){
  return Array.isArray(arr) ? arr : [arr];
}

exports = module.exports = MySqlBackend;
