// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova', 'ngCordova'])

//    'ionic.service.core',
//    'ionic.service.push',
//    'ionic.service.deploy'

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
  });
})

//.run(function($rootScope, $ionicDeploy, $ionicPlatform, $cordovaStatusbar) {
//
//  $ionicPlatform.ready(function() {
//
//    // Hide the accessory bar by default
//    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//    }
//
//    // Color the iOS status bar text to white
//    if (window.StatusBar) {
//      $cordovaStatusbar.overlaysWebView(true);
//      $cordovaStatusBar.style(1); //Light
//    }
//
//    // Default update checking
//    $rootScope.updateOptions = {
//      interval: 2 * 60 * 1000
//    };
//
//    // Watch Ionic Deploy service for new code
//    $ionicDeploy.watch($rootScope.updateOptions).then(function() {}, function() {}, function(hasUpdate) {
//      $rootScope.lastChecked = new Date();
//      console.log('WATCH RESULT', hasUpdate);
//    });
//  });
//})
//
//.config(['$ionicAppProvider', function($ionicAppProvider) {
//  // Identify app
//  $ionicAppProvider.identify({
//    // The App ID (from apps.ionic.io) for the server
//    app_id: 'YOUR_APP_ID',
//    // The public API key all services will use for this app
//    api_key: 'YOUR_API_KEY',
//    // The GCM project ID (project number) from your Google Developer Console (un-comment if used)
//    //gcm_id: 'GCM_ID',
//  });
//}]);