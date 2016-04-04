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
		"maxFileSize": 8388608,
		"queueLimit": 100
	}
})

;
})(angular);