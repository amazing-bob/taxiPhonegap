cordova.define("org.apache.cordova.phonenumber", function(require, exports, module) {
	var exec = require("cordova/exec");
	
	var PhoneNumber = function() {};

	PhoneNumber.prototype.getPhoneNo = function(successCallback, errorCallback) {
	    exec(successCallback, errorCallback, "PhoneNumber", "getPhoneNo", []);
	};
	
	module.exports = new PhoneNumber();
});


