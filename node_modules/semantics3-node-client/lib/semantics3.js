var oauth = require('oauth');


function Semantics3(apiKey, apiSecret) {
  if (!(this instanceof Semantics3)) {
    throw new TypeError("Semantics3 constructor cannot be called as a function.");
  }

  this.hostURL = "https://api.semantics3.com/v1/";
  this.oauth = new oauth.OAuth(null, null, apiKey, apiSecret, '1.0', null, 'HMAC-SHA1');
}


Semantics3.prototype = {
  constructor: Semantics3,

  url: function(endpoint, params) {
    return this.hostURL + endpoint + "/" + "?q=" + params;
  },

  query: function(endpoint, params, callback) {
    var url = this.url(endpoint, JSON.stringify(params));
    this.oauth.get(url, null, null, this._parse(callback));
  },

  _parse: function(callback) {
    return function(err, result, response) {

      try {
        result = JSON.parse(result);
      } catch (e) {
        err = {
          statusCode: 500,
          data: "Can't parse JSON result: " + result
        };
      }

      callback(err, result);
    };
  }

};


module.exports = Semantics3;