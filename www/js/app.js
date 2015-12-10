// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova', 'ngCordova', 'credit-cards'])



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    // Stripe Logic
    console.log("window.stripe ", window.stripe);
      //alert(window.stripe);

      //createCharge()
    });

    function testStripe() {
      // https://stripe.com/docs/api#list_customers
      stripe.customers.list({
          limit: "2" // both value as string and number are supported
        },
        function(response) {
          console.log(JSON.stringify(response, null, 2));

          createCustomer();
        },
        function(response) {
          alert(JSON.stringify(response))
        } // error handler
      );
    }


    function createCustomer() {
      // creating a customer: https://stripe.com/docs/api#create_customer
      stripe.customers.create({
          description: "Ashok Tamang",
          email: "ashok.tamang@bison.howard.edu"
        },
        function(response) {
          alert("Customer created:\n\n" + JSON.stringify(response))
          console.log(JSON.stringify(response, null, 2))
        },
        function(response) {
          alert(JSON.stringify(response))
        } // error handler
      );
    }
});
