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

		//Populate user's sessions
		Parse.getAllSessions($scope.userId).then(function(data) {
			console.log(data);
			console.log('all sessions', data.results);
			$scope.sessions = data.results;
		});
	});


	//slide menu
	$scope.delete = function(sessionId) {
		var confirmPopup = $ionicPopup.confirm({
			 title: 'Alert',
			 template: 'Are you sure you want to delete this session?'
		});
		confirmPopup.then(function(res) {
			if(res) {
				console.log('You are sure');
				Parse.removeSession(sessionId).then(function(response){
					console.log("Deleted", response);

					Parse.getAllSessions($scope.userId).then(function(data) {
						console.log('all sessions', data.results);
						$scope.sessions = data.results;
					});
				})
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
		$scope.session = {};

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



	//Go to Specific session details
	$scope.GotoSessiondetails = function (objectId) {
		$state.go('tabsController.newSession', { sessionId: objectId })
	};

	$scope.doRefresh = function(){
		Parse.getAllSessions($scope.userId).then(function(data) {
			console.log('all sessions', data.results);
			$scope.sessions = data.results;
		});
		$scope.$broadcast('scroll.refreshComplete');
	}


})
   
.controller('historyCtrl', function($scope, Parse, FacebookAuth) {
	FacebookAuth.currentUser().then(function(response){
		console.log('user in PROFILE', response);
		$scope.userId = response.data.results[0].fb_id;

		Parse.getSessionsfromHistory($scope.userId).then(function(response) {
			console.log(response);
			$scope.sessions = response.results;
		});
	});

})
   
.controller('profileCtrl', function($scope, FacebookAuth) {
	FacebookAuth.currentUser().then(function(response){
		console.log('user in PROFILE', response);
		$scope.user = response.data.results[0];
	});
})
      
.controller('newSessionCtrl', function($scope, Parse, SemanticsService, $ionicPopup, $state, $stateParams, FacebookAuth, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, appService, $ionicPopover) {
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
	});

	// Parse.getAllCollaborators($scope.sessionId).then(function(response) {
	// 	console.log("current collaborators", response);
	// 	$scope.collaborators = response.data.collaborators;
	// })

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
				     template: "You either entered an invalid email or email that is not in our database."
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
			var userInfo = {
				"email": userEmail,
				"money_owed": 0
			}

			Parse.addUsertoSession(userInfo, $scope.sessionId).then(function(response) {
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

	$scope.addPeople = function(item) {
		alert('add');
	};

	$scope.onDragRight = function(item) {
		alert('dragged');
	};

	var template = '<ion-popover-view><ion-header-bar> <h1 class="title"></h1>' +
					'</ion-header-bar> <ion-list>' + 
					'<ion-item ng-repeat="person in collaborators"> {{ person.email }} </ion-item></ion-list>' + 
					'<ion-content> </ion-content></ion-popover-view>';

	  $scope.popover = $ionicPopover.fromTemplate(template, {
	    scope: $scope
	  });

	$scope.openPopover = function($event) {
	    $scope.popover.show($event);

	    Parse.getAllCollaborators($scope.sessionId).then(function(response) {
			console.log("current collaborators", response);
			$scope.collaborators = response.data.collaborators;
		})	
	  };
	  $scope.closePopover = function() {
	    $scope.popover.hide();
	  };
	  //Cleanup the popover when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.popover.remove();
	  });
	  // Execute action on hide popover
	  $scope.$on('popover.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove popover
	  $scope.$on('popover.removed', function() {
	    // Execute action
	  });


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

			          		if (productInfo.price != null) {
			          			Parse.addToCart(productInfo, $scope.sessionId).then(function(response) {
				          			console.log(response);
				          			var alertPopup = $ionicPopup.alert({
									     title: "Hurray",
									     template: 'Item is added to your cart'
									});
				          		});
			          		}

			          		
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
   
.controller('cartCtrl', function($scope, $stateParams, Parse, $state) {
	console.log($stateParams);
	$scope.sessionId = $stateParams.sessionId;

	$scope.edit = function(item) {
		alert('edit');
	};
	$scope.remove = function(item) {
		alert('delete');
	};

	Parse.getSessionbyId($scope.sessionId).then(function(response) {
		$scope.total = 0;
		$scope.cartItems = response.cartItems;
		for (index in $scope.cartItems) {
			var item = $scope.cartItems[index];
			$scope.total += item.price * item.quantity;

		}
		$scope.total = $scope.total.toFixed(2);
		console.log($scope.total.toFixed(2));
	})

	$scope.gotoCheckout = function() {
		$state.go('tabsController.checkout', { "sessionId": $scope.sessionId })
	}

})
   
.controller('checkoutCtrl', function($scope, Parse, $stateParams, $state) {
	$scope.sessionId = $stateParams.sessionId;


	

	$scope.cardType = {};
    $scope.card = {};

    $scope.makeStripePayment = makeStripePayment;

    Parse.getSessionbyId($scope.sessionId).then(function(response) {
			$scope.total = 0;
			$scope.cartItems = response.cartItems;
			for (index in $scope.cartItems) {
				var item = $scope.cartItems[index];
				$scope.total += item.price * item.quantity;

			}
			$scope.total = $scope.total.toFixed(2);
		});


    /**
     */
    function makeStripePayment(_cardInformation) {

      if (!window.stripe) {
        alert("stripe plugin not installed");
        return;
      }

      if (!_cardInformation) {
        alert("Invalid Card Data");
        return;
      }


      //Calculate total amount to be charged and Charge with valid card info
	    Parse.getSessionbyId($scope.sessionId).then(function(response) {
			$scope.total = 0;
			$scope.cartItems = response.cartItems;
			for (index in $scope.cartItems) {
				var item = $scope.cartItems[index];
				$scope.total += item.price * item.quantity;

			}
			console.log($scope.total.toFixed(2));
			$scope.total = $scope.total.toFixed(2);

			//Charge user
			stripe.charges.create({
	          // amount is in cents so * 100
	          amount: $scope.total * 100,
	          currency: 'usd',
	          card: {
	            "number": '4242424242424242',
	            "exp_month": '11',
	            "exp_year": '21',
	            "cvc": '123',
	            "name": "Ashok Tamang"
	          },
	          description: "Stripe Test Charge"
	        },
	        function(response) {
	          console.log(JSON.stringify(response, null, 2));
	          alert(JSON.stringify(response, null, 2));
	        },
	        function(response) {
	          alert(JSON.stringify(response))
	        });
	    });

	    Parse.moveSessiontoHistory($scope.sessionId, $scope.total).then(function(response) {
	    	console.log("movingtohistory", response);
	    	$state.go('tabsController.dashboard', {}, {reload: true});
	    })
      
	};
});
 