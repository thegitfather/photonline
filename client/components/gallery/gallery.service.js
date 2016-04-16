'use strict';

(function() {

  function GalleryResource($resource) {
    return $resource('/api/gallery/:id');
  }

  angular.module('photoboxApp')
    .service('Gallery', GalleryResource);

})();
