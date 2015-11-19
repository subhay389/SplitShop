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

.service('BlankService', function(){

});

