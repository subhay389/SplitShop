angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, $state, FacebookAuth) {
	// var fbLoginSuccess = function (userData) {
 //      alert("UserInfo: " + JSON.stringify(userData));
 //    };
	
	

    $scope.login = function () {
      FacebookAuth.login().then(function(success) {
	    	console.log(success);
	    	$state.go("tabsController.dashboard");
	    }, function (error) {
	    	console.log(error);
	    });
	}

})

   
.controller('dashboardCtrl', function($scope, $state, Parse, FacebookAuth) {
	FacebookAuth.currentUser().then(function(data){
		console.log('user in dashboard', data);
		$scope.userId = data.data.results[0].fb_id;
		$scope.objectId = data.data.results[0].objectId;
	});

	$scope.createSession = function() {
		var sessionInfo = {
			name: "Untitled Session",
			owner: $scope.userId,
			owner_objectId: $scope.objectId,
			collaborators: [],
			cartItems: []
		}
		Parse.createGroup(sessionInfo).then(function(response) {
			console.log(response);
			$scope.sessionId = response.data.objectId;
			console.log('newsessionId', $scope.sessionId);
			$state.go('newSession', { sessionId: $scope.sessionId })
		}, function(error) {
			console.log("Session was not created", error);
		})
	}

	
})
   
.controller('historyCtrl', function($scope) {

})
   
.controller('profileCtrl', function($scope, FacebookAuth) {
	FacebookAuth.currentUser().then(function(data){
		console.log('user in PROFILE', data);
		$scope.user = data.data.results[0];
	});
})
      
.controller('newSessionCtrl', function($scope, Parse, $state, $stateParams) {
	$scope.sessionId = $state.params;
	console.log('sessionid', $scope.sessionId);
	console.log($stateParams);
})	
   
.controller('signupCtrl', function($scope) {

})
   
.controller('shoppingCtrl', function($scope, FacebookAuth) {
	//FacebookAuth.getStuff('635753490879').then(function(_response){})
	//$scope.item = _response;
	//console.log(_response);
})
   
.controller('itemDetailCtrl', function($scope) {

})
   
.controller('cartCtrl', function($scope) {

})
   
.controller('checkoutCtrl', function($scope) {

})
 