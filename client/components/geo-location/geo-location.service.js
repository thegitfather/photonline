'use strict';

angular.module('photonlineApp').service('geoLocation', function($q, $http, appConfig) {

  var config = { responseType: "json", cache: true, timeout: 500 };

  return $http.get('http://ip-api.com/json', config).then(function(res) {
    appConfig.geoLocation = res.data;
    return res.data;
  }, function() {
    console.error("$http.get() in geo-location service");
  });

});
