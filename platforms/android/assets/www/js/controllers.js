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

	$scope.test = function() {

		var url = "https://api.semantics3.com/test/v1/products?q=";
		var queryString = '{"upc": "1045440701246"}';
		var options = {
		headers: {
		  api_key: "SEM3082A89A99C4CDC4A3D3728C47442EF08"
		}
		};
		$http.get(url + queryString, options).then(function(data) {
			console.log('results', data);
		});
	}

	$scope.showSessionPopup = function() {
		$scope.data = {}

		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
		template: '<input type="text" ng-model="sessionName">',
		title: 'Enter Session Name',
		subTitle: 'Please write something this is clear to you.',
		scope: $scope,
		buttons: [
		  { text: 'Cancel' },
		  {
		    text: '<b>Save</b>',
		    type: 'button-positive',
		    onTap: function(e) {
		      if (!$scope.sessionName) {
		        //don't allow the user to close unless he enters wifi password
		        e.preventDefault();
		      } else {
		        return $scope.sessionName;
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
 