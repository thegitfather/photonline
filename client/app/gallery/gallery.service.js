'use strict';

// angular.module('photoboxApp')
//   .service('gallery', function () {
//     // AngularJS will instantiate a singleton by calling "new" on this function
//   });


(function() {

  function GalleryResource($resource) {
    return $resource('/api/gallery/:id');
  }

  angular.module('photoboxApp')
    .service('Gallery', GalleryResource);

})();
