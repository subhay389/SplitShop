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
    };
})

.service('FacebookAuth', function($http, $q, $cordovaFacebook){
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

                return $cordovaFacebook.api("me?access_token=" + accessToken + fbValues, fbPermission)
            		.then(function (_fbUserInfo) {
            			console.log(_fbUserInfo);
            			return _fbUserInfo;
					});	
			});
        };
	return {
		login: login
	}
});

