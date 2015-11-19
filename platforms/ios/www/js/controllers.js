angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, $cordovaFacebook) {
	var fbLoginSuccess = function (userData) {
      alert("UserInfo: " + JSON.stringify(userData));
    };

    $scope.doLogin = function () {
      $cordovaFacebook.login(["public_profile"],
        fbLoginSuccess,
        function (error) {
          alert("" + error)
        }
      );
    };

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
 