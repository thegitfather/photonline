(function(angular, undefined) {
  angular.module("photonlineApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	],
	"uploadLimits": {
		"minFileSize": 10240,
		"maxFileSize": 6291456,
		"queueLimit": 200
	}
})

;
})(angular);