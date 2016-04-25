'use strict';

(function() {

  function GalleryResource($resource) {
    return $resource('/api/gallery/:id');
  }

  angular.module('photonlineApp')
    .service('Gallery', GalleryResource);

})();
