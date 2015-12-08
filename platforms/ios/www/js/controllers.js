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
		var confirmPopup = $ionicPopup.confirm({
			 title: 'Alert',
			 template: 'Are you sure you want to delete this session?'
		});
		confirmPopup.then(function(res) {
			if(res) {
			console.log('You are sure');
			} else {
			console.log('You are not sure');
			}
		});
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
	FacebookAuth.currentUser().then(function(response){
		console.log('user in PROFILE', response);
		$scope.user = response.data.results[0];
	});
})
      
.controller('newSessionCtrl', function($scope, Parse, SemanticsService, $ionicPopup, $state, $stateParams, FacebookAuth, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, appService) {
	FacebookAuth.currentUser().then(function(response){
		console.log('user in PROFILE', response);
		$scope.user = response.data.results[0];
	});

	$scope.sessionId = $state.params.sessionId;
	console.log('sessionid', $scope.sessionId);
	console.log($stateParams);

	Parse.getSessionbyId($scope.sessionId).then(function(response) {
		console.log("currentSession", response);
		$scope.currentSession = response;
	})

	$scope.product_results = [];
	$scope.searchQueryString = function (SearchQuery) {
		console.log(SearchQuery);
		SemanticsService.getProductbyKeyword(SearchQuery).then(function(response) {
			console.log("product search", response);
			$scope.product_results = response.data.results;
		})
	}

	$scope.barCodeNumber = '';
	$scope.date;
	$scope.click = function() {
		var promise = appService.scanBarcode();
		promise.then(
				function(result) {
					if (result.error == false) {
						var d = new Date();
						$scope.date = d.toUTCString();
						$scope.barCodeNumber = '<table>' +
								'<tbody>' +
								'<tr><td>Timestamp:</td><td>&nbsp;</td><td>' + d.toUTCString() + '</td></tr>' +
								'<tr><td>Text:</td><td>&nbsp;</td><td>' + result.result.text + '</td></tr>' +
								'<tr><td>Format:</td><td>&nbsp;</td><td>' + result.result.format + '</td></tr>' +
								'<tr><td>Text:</td><td>&nbsp;</td><td>' + result.result.cancelled + '</td></tr>' +
								'</tbody>' +
								'</table>';

						SemanticsService.getProductbyUPC(result.result.text).then(function (response) {
							console.log("product search", response);
							$scope.product_results = response.data.results;
						})
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
				})

				//function(result) {
				//	SemanticsService.getProductbyUPC(result.result.text).then(function (response) {
				//		console.log("product search", response);
				//		$scope.product_results = response.data.results;
				//	})

	};

	$scope.clear = function() {
		$scope.barCodeNumber = '';
	};

	$scope.addToCart = function (product) {
		console.log(product);
		$scope.item = {}

		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
		    template: '<input type="number" min="1" step="1" ng-model="item.quantity" ng-init="item.quanitity=\'1\'">',
		    title: 'Adding item into your Cart',
		    subTitle: 'Please specify the quantity of the item.',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel' },
		      {
		        text: '<b>Save</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		          if (!$scope.item.quantity) {
		            //don't allow the user to close unless he enters wifi password
		            e.preventDefault();
		          } else if($scope.item.quantity < 1) {
			          	var alertPopup = $ionicPopup.alert({
						     title: "Uh Oh!",
						     template: "You entered invalid number."

						});
		          } else {
		          		var productInfo = {
		          			"name" : product.name,
		          			"description": product.description,
		          			"price": product.price,
		          			"price_currency": product.price_currency,
		          			"quantity": $scope.item.quantity
		          		};

		          		Parse.addToCart(productInfo, $scope.sessionId).then(function(response) {
		          			console.log(response);
		          			var alertPopup = $ionicPopup.alert({
							     title: "Hurray",
							     template: 'Item is added to your cart'
							});
		          		});
		          	};
		            return $scope.item.quantity;
		          }
		        }
		    ]
		  });
		  myPopup.then(function(res) {
		    console.log('Tapped!', res);
		    myPopup.close();
		  });
	}

	$scope.searchPeople = function (userEmail) {
		console.log(userEmail);
		Parse.getUserbyEmail(userEmail).then(function(response) {
			console.log(response);
			if (response.data.results.length != 0) {
				$scope.searchPeopleresult = response.data.results[0];
			}
			else {
				var alertPopup = $ionicPopup.alert({
				     title: "Uh Oh!",
				     template: "No user found. Try again with a different email."
				});
			}
		})
	};

	$scope.gotoItemDetails = function (productId) {
		$state.go('tabsController.itemDetail', { sessionId: $scope.sessionId, sem3_id: productId })
	};

	$scope.goToCart = function () {
		$state.go('tabsController.cart', { sessionId: $scope.sessionId })
	};

	


	$scope.addUser = function(userEmail) {
		console.log(userEmail);
		if ($scope.user.email != userEmail && userEmail != null) {
			Parse.addUsertoSession(userEmail, $scope.sessionId).then(function(response) {
			console.log(response);
			var alertPopup = $ionicPopup.alert({
			     title: "Congrats!",
			     template: userEmail + " is added to the session"
			});
			}, function(error) {
				alert(error);
			})
		} else if ($scope.user.email == userEmail) {
			var alertPopup = $ionicPopup.alert({
			     title: "Sorry",
			     template: 'You cannot add yourself to the session. You are the owner.'
			});
		} else {
			var alertPopup = $ionicPopup.alert({
			     title: "Oh uh!",
			     template: 'Something is wrong.'
			});
		}	
	}
})	
   
.controller('signupCtrl', function($scope) {

})
   
.controller('shoppingCtrl', function($scope) {
	
})

   
.controller('itemDetailCtrl', function($scope, $state, $stateParams, SemanticsService, Parse, $ionicPopup, $ionicHistory) {
	$scope.productId = $stateParams.sem3_id;
	$scope.sessionId = $stateParams.sessionId;
	console.log($stateParams);
	SemanticsService.getProductbySem3Id($scope.productId).then(function(response) {
		console.log(response);
		$scope.item = response.data.results[0];
		console.log($scope.item);
	})

	$scope.addToCart = function() {
		$scope.item = {}

		  // An elaborate, custom popup
		  var myPopup = $ionicPopup.show({
		    template: '<input type="number" min="1" step="1" ng-model="item.quantity" ng-init="item.quanitity=\'1\'">',
		    title: 'Adding item into your Cart',
		    subTitle: 'Please specify the quantity of the item.',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel' },
		      {
		        text: '<b>Save</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		          if (!$scope.item.quantity) {
		            //don't allow the user to close unless he enters wifi password
		            e.preventDefault();
		          } else if($scope.item.quantity < 1) {
			          	var alertPopup = $ionicPopup.alert({
						     title: "Uh Oh!",
						     template: "You entered invalid number."

						});
		          } else {
		          		SemanticsService.getProductbySem3Id($scope.productId).then(function(response) {
		          			var product = response.data.results[0];
		          			var productInfo = {
			          			"name" : product.name,
			          			"description": product.description,
			          			"price": product.price,
			          			"price_currency": product.price_currency,
			          			"quantity": $scope.item.quantity
			          		};

			          		Parse.addToCart(productInfo, $scope.sessionId).then(function(response) {
			          			console.log(response);
			          			var alertPopup = $ionicPopup.alert({
								     title: "Hurray",
								     template: 'Item is added to your cart'
								});
			          		});
		          		})
		          		
		          	};
		            return $scope.item.quantity;
		          }
		        }
		    ]
		  });
		  myPopup.then(function(res) {
		    console.log('Tapped!', res);
		    myPopup.close();
		  });
		

		  
	}


})
   
.controller('cartCtrl', function($scope, $stateParams, Parse) {
	console.log($stateParams);
	$scope.sessionId = $stateParams.sessionId;

	Parse.getSessionbyId($scope.sessionId).then(function(response) {
		$scope.cartItems = response.cartItems;
		for (item in $scope.cartItems) {
			console.log($scope.cartItems[item]);
		}
	})

})
   
.controller('checkoutCtrl', function($scope) {

});
 