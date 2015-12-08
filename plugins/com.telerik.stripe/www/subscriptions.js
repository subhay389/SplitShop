var exec = require('cordova/exec');
var channel = require('cordova/channel');

function Subscriptions(){
  this.processRequest = function(args, cb, error){
      exec(cb,error, "Stripe", "process", args);
  };
}

Subscriptions.prototype.create = function(id, arg, successCallback, errorCallback){
    this.processRequest(["POST", 'customers/' + id + "/subscriptions", arg], successCallback, errorCallback);
}

Subscriptions.prototype.retrieve = function(customerId, subscriptionId, successCallback, errorCallback){
    this.processRequest(["GET","customers/" + customerId + "/subscriptions/" + subscriptionId, null], successCallback, errorCallback);
}

Subscriptions.prototype.update = function(customerId, subscriptionId, arg, successCallback, errorCallback){
    this.processRequest(["POST","customers/" + customerId + "/subscriptions/" + subscriptionId, arg], successCallback, errorCallback);
}

Subscriptions.prototype.list = function(id, arg, successCallback, errorCallback){
    if (typeof(arg) !== "function"){
      this.processRequest(["GET","customers/" + id + "/subscriptions", arg], successCallback, errorCallback);
    }
    else{
      this.processRequest(["GET","customers/" + id + "/subscriptions", null], arg, successCallback);
    }
}

Subscriptions.prototype.remove = function(customerId, subscriptionId, successCallback, errorCallback){
    this.processRequest(["DELETE", "customers/" + customerId + "/subscriptions/" + subscriptionId, null], successCallback, errorCallback);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = new Subscriptions();
}