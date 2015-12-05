var Semantics3 = require('../');
var client = new Semantics3("YOUR_API_KEY", "YOUR_API_SECRET");

var params = {
  "search": "Samsung Galaxy"
};

client.query("products", params, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});