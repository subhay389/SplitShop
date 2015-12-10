angular.module('app.services', [])

.factory('Parse', function($http){
	var baseURL = "https://api.parse.com/1/";


	var authenticationHeaders = PARSE__HEADER_CREDENTIALS;

    var defaultSettings = {
        "async": true,
        "crossDomain": true,
        headers: authenticationHeaders,
    };


    return {
        //Sessions
    	createGroup: function(data) {
    		return $http.post(baseURL + "classes/groups", data, defaultSettings)
    			.then(function(_response) {
    				console.log(_response);
    				return _response;
    			});
    	},

        getAllSessions: function(UserId) {
            var params = {
                "owner": UserId
            }
            return $http.get(baseURL + "classes/groups?where=" + JSON.stringify(params), defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response.data;
                });
        },

        getSessionbyId: function(sessionId) {
            return $http.get(baseURL + "classes/groups/" + sessionId, defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response.data;
                });
        },

        addUsertoSession: function(userInfo, sessionId) {
            var data = {
                "collaborators": {
                    "__op":"AddUnique",
                    "objects": [userInfo]
                }
            };

            return $http.put(baseURL + "classes/groups/" + sessionId, data, defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response.data;
                });
        },

        addToCart: function(productInfo, sessionId) {
            var data = {
                "cartItems": {
                    "__op":"AddUnique",
                    "objects": [productInfo]
                }
            };

            return $http.put(baseURL + "classes/groups/" + sessionId, data, defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response.data;
                });
        },

        getItemsfromCart: function(sessionId) {
            return $http.get(baseURL + "classes/groups/" + sessionId, defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response;
                });
        },

        getAllCollaborators: function(sessionId) {
            return $http.get(baseURL + "classes/groups/" + sessionId, defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response;
                });
        },

        removeSession: function(sessionId) {
            return $http.delete(baseURL + "classes/groups/" + sessionId, defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response;
                });
        },

        moveSessiontoHistory: function(sessionId, totalcharge) {
            $http.get(baseURL + "classes/groups/" + sessionId, defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    _response = _response.data;
                    var data = {
                        "cartItems": _response.cartItems,
                        "collaborators": _response.collaborators,
                        "name": _response.name,
                        "owner": _response.owner,
                        "owner_objectId": _response.owner_objectId,
                        "original_objectId": _response.objectId,
                        "original_createdAt": _response.createdAt,
                        "total_expense": totalcharge
                    };

                    $http.delete(baseURL + "classes/groups/" + sessionId, defaultSettings)
                        .then(function(_response) {
                            console.log(_response);
                            return _response;
                    });
                    return $http.post(baseURL + "classes/session_history/", data, defaultSettings)
                        .then(function(response) {
                            console.log("moving", response);
                            return response;
                        })
                });
        },

        getSessionsfromHistory: function(UserId) {
            var params = {
                "owner": UserId
            };

            return $http.get(baseURL + "classes/session_history?where=" + JSON.stringify(params), defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response.data;
                });
        },


        //Users
    	addUser: function(UserData) {
    		return $http.post(baseURL + "classes/person", UserData, defaultSettings)
    			.then(function(_response) {
    				console.log(_response);
    				return _response;
    			});
    	},

    	getUser: function(UserId) {
    		var params = {
    			"fb_id": UserId
    		}
			return $http.get(baseURL + "classes/person?where=" + JSON.stringify(params), defaultSettings)
    			.then(function(_response) {
    				console.log(_response);
    				return _response;
    			});
    	},

        getUserbyEmail: function(userEmail) {
            var params = {
                "email": userEmail
            }
            return $http.get(baseURL + "classes/person?where=" + JSON.stringify(params), defaultSettings)
                .then(function(_response) {
                    console.log(_response);
                    return _response;
                });
        },
    };
})

.service('FacebookAuth', function($http, $state, $q, $cordovaFacebook, Parse){
	var login = function() {
		return $cordovaFacebook.login(["public_profile", "email"])
            .then(function (success) {
                // save access_token
                var accessToken = success.authResponse.accessToken;
                var userID = success.authResponse.userID;
                var expiresIn = success.authResponse.expiresIn;
 
                console.log("Login Success" + JSON.stringify(success));

                var expDate = new Date(
                    new Date().getTime() + expiresIn * 1000
                ).toISOString();
 				
 				var fbValues = "&fields=id,name,picture,email";
                var fbPermission = ["public_profile", "email"];

                $cordovaFacebook.api("me?access_token=" + accessToken + fbValues, fbPermission)
            		.then(function (_fbUserInfo) {
            			console.log("fbUserinfo", _fbUserInfo);
            			var UserData = {
            				"name": _fbUserInfo.name,
            				"email": _fbUserInfo.email,
            				"fb_id" : _fbUserInfo.id,
            				"photo": _fbUserInfo.picture.data.url
            			};
            			Parse.getUser(UserData.fb_id).then(function(result){
            				if (result.data.results.length != 0) {
            					console.log("User exists in the database");
            					return _fbUserInfo;
            				} else {
            					
            					return Parse.addUser(UserData).then(function(success){
	            					console.log("User added", success);
	            					return success;
            					}) 
            				}
            			})
            			
					});	
			});
        };

        var currentUser = function() {
        	return $cordovaFacebook.getLoginStatus().then(function(success) {
	        	console.log("getLoginStatus", success);
	        	var accessToken = success.authResponse.accessToken;
	            var userID = success.authResponse.userID;
	            var expiresIn = success.authResponse.expiresIn;

	            var expDate = new Date(
	                new Date().getTime() + expiresIn * 1000
	            ).toISOString();
					
				var fbValues = "&fields=id,name,picture,email";
	            var fbPermission = ["public_profile", "email"];

	            return $cordovaFacebook.api("me?access_token=" + accessToken + fbValues, fbPermission)
	        		.then(function (_fbUserInfo) {
	        			var UserId = _fbUserInfo.id;
	        			console.log(currentUser.objectId);
	        			return Parse.getUser(UserId).then(function(success) {
			    			console.log("currentUser", success);
			    			return success;
			    		});
	        	})
        	})
    		

    	};

	return {
		login: login,
		currentUser: currentUser
	};


})

.service('appService', function appService($q) {
	// Wrap the barcode scanner in a service so that it can be shared easily.
	this.scanBarcode = function() {
		// The plugin operates asynchronously so a promise
		// must be used to display the results correctly.
		var deferred = $q.defer();
		try {
			cordova.plugins.barcodeScanner.scan(
					function (result) {  // success
						deferred.resolve({'error':false, 'result': result});
					},
					function (error) {  // failure
						deferred.resolve({'error':true, 'result': error.toString()});
					}
			);
		}
		catch (exc) {
			deferred.resolve({'error':true, 'result': 'exception: ' + exc.toString()});
		}
		return deferred.promise;
	};
})


.factory('SemanticsService', function($http){

    var url = "https://api.semantics3.com/test/v1/products?q=";
    var queryString = '{"upc": "1045440701246"}';
    var options = {
        headers: SEMANTICS_HEADER_CREDENTIALS
    };
    
    return {
        getProductbyUPC : function(upcId) {
            var queryString = {
                "upc": upcId
            };
            return $http.get(url + JSON.stringify(queryString), options).then(function(data) {
                console.log('results', data);
                return data;
            })
        },

        getProductbyKeyword : function(searchQuery) {
            var queryString = {
                "search": searchQuery
            };
            return $http.get(url + JSON.stringify(queryString), options).then(function(data) {
                console.log('results', data);
                return data;
            })
        },

        getProductbySem3Id : function(sem3Id) {
            var queryString = {
                "sem3_id": sem3Id
            };
            return $http.get(url + JSON.stringify(queryString), options).then(function(data) {
                console.log('results', data);
                return data;
            })
        }
    };
})

