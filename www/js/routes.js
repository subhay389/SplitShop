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
      
    
      
        
    //.state('newSession', {
    //  url: '/newSession/:sessionId',
    //  templateUrl: 'templates/newSession.html',
    //  controller: 'newSessionCtrl'
    //})
    //
    //
      .state('tabsController.newSession', {
        url: '/newSession/:sessionId',
        views: {
          'tab1': {
            templateUrl: 'templates/newSession.html',
            controller: 'newSessionCtrl'
          }
        }
      })
      
        
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
        
      
    
      
        
    .state('tabsController.shopping', {
      url: '/shopping',
      views: {
        'tab1': {
          templateUrl: 'templates/shopping.html',
          controller: 'shoppingCtrl'
        }
      }

    })
        
      
    
      
        
    .state('tabsController.itemDetail', {
      url: '/itemdetail',
      views: {
        'tab1': {
          templateUrl: 'templates/itemDetail.html',
          controller: 'itemDetailCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.cart', {
      url: '/cart',
      views: {
        'tab1': {
          templateUrl: 'templates/cart.html',
          controller: 'cartCtrl'
        }
      }

    })
        
      
    
      
        
    .state('tabsController.checkout', {
      url: '/Checkout',
      views: {
        'tab1': {
          templateUrl: 'templates/checkout.html',
          controller: 'checkoutCtrl'
        }
      }

    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});