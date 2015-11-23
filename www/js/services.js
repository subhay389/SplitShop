angular.module('app.services', [])

.factory('Parse', function($http){
	var baseURL = "https://api.parse.com/1/";


	var authenticationHeaders = PARSE__HEADER_CREDENTIALS;

    var defaultSettings = {
        "async": true,
        "crossDomain": true,
        headers: authenticationHeaders,
    };

    var data = {
    	"name": "Testing",
    	"message": "hello"
    };

    // var dataString = JSON.stringify(data);


    return {
    	createGroup: function() {
    		return $http.post(baseURL + "classes/groups", data, defaultSettings)
    			.then(function(_response) {
    				console.log(_response);
    				return _response;
    			});
    	},

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
    };
})

.service('FacebookAuth', function($http, $state, $q, $cordovaFacebook, Parse){
	var currentUser = {
		"id": null
	};

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
            			console.log("UserData", UserData);

            			Parse.getUser(UserData.fb_id).then(function(result){
            				if (result.data.results.length != 0) {
            					console.log("User exists in the database")
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
        	$cordovaFacebook.getLoginStatus().then(function(success) {
        	console.log("getLoginStatus", success);
        	var accessToken = success.authResponse.accessToken;
            var userID = success.authResponse.userID;
            var expiresIn = success.authResponse.expiresIn;

            var expDate = new Date(
                new Date().getTime() + expiresIn * 1000
            ).toISOString();
				
				var fbValues = "&fields=id,name,picture,email";
            var fbPermission = ["public_profile", "email"];

            $cordovaFacebook.api("me?access_token=" + accessToken + fbValues, fbPermission)
        		.then(function (_fbUserInfo) {
        			currentUser.objectId = _fbUserInfo.id;
        		})
        	})
    		return Parse.getUser(currentUser.objectId).then(function(success) {
    			console.log("getUser", success);
    			return success;
    		});

    	};

	return {
		login: login,
		currentUser: currentUser
	}
});

