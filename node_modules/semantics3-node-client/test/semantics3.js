var assert = require("assert");
var sinon = require("sinon");
var oauth = require('oauth');
var Semantics3 = require('../');


describe('Test Semantics3', function() {
  var oauthClient;
  var mock;

  var client = new Semantics3("apiKey", "apiSecret");
  var expectedURL = "https://api.semantics3.com/v1/products/?q={\"search\":\"Samsung Galaxy\"}";
  var params = {
    "search": "Samsung Galaxy"
  };;

  beforeEach(function() {
    oauthClient = new oauth.OAuth(null, null, "apiKey", "apiSecret", '1.0', null, 'HMAC-SHA1');
    mock = sinon.mock(oauthClient);
    client.oauth = oauthClient;
  });


  describe('query', function() {
    it('should return error from api request', function() {
      var callback = function(err, result) {
        assert.equal(err, "ERROR");
        assert.equal(result, null);
      };

      mock.expects("get").once().withArgs(expectedURL, null, null).yields("ERROR", null);
      client.query("products", params, callback);
      mock.verify();
    });


    it('should return error due to malform JSON result', function() {
      var callback = function(err, result) {
        assert.equal(err['statusCode'], 500);
        assert.equal(err['data'], "Can't parse JSON result: InvalidJSON");
        assert.equal(result, "InvalidJSON");
      };

      mock.expects("get").once().withArgs(expectedURL, null, null).yields(null, "InvalidJSON");
      client.query("products", params, callback);
      mock.verify();
    });


    it('should return result', function() {
      var callback = function(err, result) {
        assert.equal(err, null);
        assert.equal(result["foo"], "bar");
      };

      var result = "{\"foo\": \"bar\"}";
      mock.expects("get").once().withArgs(expectedURL, null, null).yields(null, result);
      client.query("products", params, callback);
      mock.verify();
    });

  });
});