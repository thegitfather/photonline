'use strict';

angular.module('photonlineApp').service('geoLocation', function($q, $http) {

  var config = { responseType: "json", cache: true, timeout: 500 };

  // var deferred = $q.defer();
  //
  // $http.get("http://ip-api.comXXX/json", config).then(function(res) {
  //   deferred.resolve(res);
  // }, function() {
  //   console.log("errrrrrr");
  //   deferred.reject("geoLocation $http request failed");
  // });
  //
  // return deferred.promise;

  return $http.get('http://ip-api.com/json', config).then(function(res) {
    return res.data;
  }, function() {
    console.error("$http.get() in geo-location service");
  });

});
