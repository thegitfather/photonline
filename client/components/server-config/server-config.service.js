'use strict';

(function() {

  function getServerConfig($http) {
    return $http.get('/server/env').catch(err => {
      console.error(err);
    });
  }

  angular.module('photonlineApp')
    .service('ServerConfig', getServerConfig);

})();
