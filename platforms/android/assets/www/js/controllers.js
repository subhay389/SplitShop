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

   
.controller('dashboardCtrl', function(appService, $scope, $state, Parse, FacebookAuth, $rootScope, $cordovaBarcodeScanner, $ionicPlatform) {
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
		};
		Parse.createGroup(sessionInfo).then(function(response) {
			console.log(response);
			$scope.sessionId = response.data.objectId;
			console.log('newsessionId', $scope.sessionId);
			$state.go('tabsController.newSession', { sessionId: $scope.sessionId })
		}, function(error) {
			console.log("Session was not created", error);
		})
	};


})
   
.controller('historyCtrl', function($scope) {
	console.log("test");
	var api_key = '	SEM3082A89A99C4CDC4A3D3728C47442EF08';
	var api_secret = 'YjQ2YjFlODBlNGEyYmM1OTg5OThmNzUzODUzZTU4MDc';
	var sem3 = require('semantics3-node')(api_key,api_secret);
	sem3.products.products_field( "upc", "883974958450" );
	sem3.products.products_field( "field", ["name","gtins"] );
	sem3.products.get_products(
			function(err, products) {
				if (err) {
					console.log("Couldn't execute request: get_products");
					return;
				}

				// View the results of the request
				console.log( "Results of request:\n" + JSON.stringify( products ) );
			}
	);

	sem3.products.products_field( "search", "iphone" );

// Run the request
	sem3.products.get_products(
			function(err, products) {
				if (err) {
					console.log("Couldn't execute request: get_products");
					return;
				}
				// View results of the request
				console.log( "Results of request:\n" + JSON.stringify( products ) );
			}
	);
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
   
.controller('shoppingCtrl', function($scope, FacebookAuth, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, appService) {
	//FacebookAuth.getStuff('635753490879').then(function(_response){})
	//$scope.item = _response;
	//console.log(_response);

	$scope.barCodeNumber = '';
	$scope.click = function() {
		var promise = appService.scanBarcode();
		promise.then(
				function(result) {
					if (result.error == false) {
						var d = new Date();
						$scope.barCodeNumber = '<table>' +
								'<tbody>' +
								'<tr><td>Timestamp:</td><td>&nbsp;</td><td>' + d.toUTCString() + '</td></tr>' +
								'<tr><td>Text:</td><td>&nbsp;</td><td>' + result.result.text + '</td></tr>' +
								'<tr><td>Format:</td><td>&nbsp;</td><td>' + result.result.format + '</td></tr>' +
								'<tr><td>Text:</td><td>&nbsp;</td><td>' + result.result.cancelled + '</td></tr>' +
								'</tbody>' +
								'</table>';
					}
					else {
						$scope.barCodeNumber = '<b>ERROR</b>: ' + result;
					}
				},
				function(result) {
					$scope.barCodeNumber = '' + result.error;
				},
				function(result) {
					$scope.barCodeNumber = '' + result.error;
				});
	};

	$scope.clear = function() {
		$scope.barCodeNumber = '';
	};

	$scope.addToCart = function (_quantity) {

	}
})

   
.controller('itemDetailCtrl', function($scope) {

})
   
.controller('cartCtrl', function($scope) {

})
   
.controller('checkoutCtrl', function($scope) {

});
 