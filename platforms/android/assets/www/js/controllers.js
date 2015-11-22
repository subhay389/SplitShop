angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, $state, FacebookAuth) {
	var fbLoginSuccess = function (userData) {
      alert("UserInfo: " + JSON.stringify(userData));
    };

    $scope.login = function () {
      FacebookAuth.login().then(function(success) {
	    	console.log(success);
	    	$state.go("tabsController.dashboard");
	      // { id: "634565435",
	      //   lastName: "bob"
	      //   ...
	      // }
	    }, function (error) {
	      // error
	    });
	}

})

   
.controller('dashboardCtrl', function($scope, Parse) {
	$scope.test = function() {
		Parse.createGroup().then(function(_data) {
			console.log(_data);
		})
	}
})
   
.controller('historyCtrl', function($scope) {

})
   
.controller('cloudTabDefaultPageCtrl', function($scope) {

})
      
.controller('newSessionCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('shoppingCtrl', function($scope) {

})
   
.controller('itemDetailCtrl', function($scope) {

})
   
.controller('cartCtrl', function($scope) {

})
   
.controller('checkoutCtrl', function($scope) {

})
 