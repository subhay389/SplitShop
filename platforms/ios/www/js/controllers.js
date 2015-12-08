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

   
.controller('dashboardCtrl', function(appService, $scope, $http, $state, Parse, FacebookAuth, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup) {
	FacebookAuth.currentUser().then(function(data){
		console.log('user in dashboard', data);
		$scope.userId = data.data.results[0].fb_id;
		$scope.objectId = data.data.results[0].objectId;
	});


	//slide menu
	$scope.delete = function() {
		alert('Delete');
	};

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

	

	$scope.showSessionPopup = function() {
		$scope.session = {}

		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
		template: '<input type="text" ng-model="session.name" data-ng-init="session.name=\'Untitled Session\'">',
		title: 'Enter Session Name',
		subTitle: 'Please write something this is clear to you.',
		scope: $scope,
		buttons: [
		  { text: 'Cancel' },
		  {
		    text: '<b>Save</b>',
		    type: 'button-positive',
		    onTap: function(e) {
		      if (!$scope.session.name) {
		        //don't allow the user to close unless he enters wifi password
		        e.preventDefault();
		      } else {
		      	if (typeof $scope.session.name != "undefined") {
		      		var sessionInfo = {
						name: $scope.session.name,
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
		      	}
		        return $scope.session.name;
		      }
		    }
		  }
		]
		});
		myPopup.then(function(res) {
		console.log('Tapped!', res);
		myPopup.close();
		});
	};

	//Populate user's sessions
	Parse.getAllSessions($scope.userId).then(function(data) {
		console.log('all sessions', data.results);
		$scope.sessions = data.results;
	})

	//Go to Specific session details
	$scope.GotoSessiondetails = function (objectId) {
		$state.go('tabsController.newSession', { sessionId: objectId })
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
      
.controller('newSessionCtrl', function($scope, Parse, SemanticsService, $state, $stateParams, FacebookAuth, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, appService) {
	$scope.sessionId = $state.params;
	console.log('sessionid', $scope.sessionId);
	console.log($stateParams);

	$scope.product_results = [];
	$scope.searchQueryString = function (SearchQuery) {
		console.log(SearchQuery);
		SemanticsService.getProductbyKeyword(SearchQuery).then(function(response) {
			console.log("product search", response);
			$scope.product_results = response.data.results;
		})
	}

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

   
.controller('itemDetailCtrl', function($scope, $state, $stateParams, SemanticsService) {
	$scope.productId = $stateParams.sem3_id;
	console.log($stateParams);
	SemanticsService.getProductbySem3Id($scope.productId).then(function(response) {
		console.log(response);
		$scope.item = response.data.results[0];
		console.log($scope.item);
	})


})
   
.controller('cartCtrl', function($scope) {

})
   
.controller('checkoutCtrl', function($scope) {

});
 