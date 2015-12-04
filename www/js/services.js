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
    	}
    };
})

.service('FacebookAuth', function($http, $state, $q, $cordovaFacebook, Parse){
	var baseURL = 'http://webservices.amazon.com/onca/xml?' +
			'Service=AWSECommerceService' +
			'&Operation=ItemLookup' +
			'&ResponseGroup=Large' +
			'&SearchIndex=All' +
			'&IdType=UPC';
	var amazonCredentials =   '&AWSAccessKeyId=AKIAJUA2Y3JXDKXJLR5A' +
								'&AssociateTag=[Your_AssociateTag]'

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
});


