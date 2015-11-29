angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
      
    
      
        
    .state('tabsController.dashboard', {
      url: '/dashboardpage',
      views: {
        'tab1': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashboardCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.history', {
      url: '/page8',
      views: {
        'tab2': {
          templateUrl: 'templates/history.html',
          controller: 'historyCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.profile', {
      url: '/profile',
      views: {
        'tab3': {
          templateUrl: 'templates/profile.html',
          controller: 'profileCtrl'
        }
      }
    })
        
      
    
      
    .state('tabsController', {
      url: '/tabs',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
      
    
      
        
    .state('newSession', {
      url: '/newSession/:sessionId',
      templateUrl: 'templates/newSession.html',
      controller: 'newSessionCtrl'
    })
        
      
    
      
        
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
        
      
    
      
        
    .state('shopping', {
      url: '/shopping',
      templateUrl: 'templates/shopping.html',
      controller: 'shoppingCtrl'
    })
        
      
    
      
        
    .state('itemDetail', {
      url: '/itemdetail',
      templateUrl: 'templates/itemDetail.html',
      controller: 'itemDetailCtrl'
    })
        
      
    
      
        
    .state('cart', {
      url: '/cart',
      templateUrl: 'templates/cart.html',
      controller: 'cartCtrl'
    })
        
      
    
      
        
    .state('checkout', {
      url: '/Checkout',
      templateUrl: 'templates/checkout.html',
      controller: 'checkoutCtrl'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});