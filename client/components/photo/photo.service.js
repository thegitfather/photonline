'use strict';

(function() {

  function PhotoResource($resource) {
    return $resource('/api/photo/:id');
  }

  angular.module('photonlineApp')
    .service('Photo', PhotoResource);

})();
