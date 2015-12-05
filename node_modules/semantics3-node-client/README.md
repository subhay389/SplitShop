# Semantics3 api client in nodejs.
[![Build Status](https://travis-ci.org/pirsquare/semantics3-node-client.svg?branch=master)](https://travis-ci.org/pirsquare/semantics3-node-client)

## Installation

    npm install semantics3-node-client

## Examples
```javascript
var Semantics3 = require('semantics3-node-client');
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

```