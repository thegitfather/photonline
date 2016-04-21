(function(angular, undefined) {
  angular.module("photoboxApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	],
	"uploadLimits": {
		"minFileSize": 10240,
		"maxFileSize": 6291456,
		"queueLimit": 100
	}
})

;
})(angular);