'use strict';

angular.module('photonlineApp')
  .controller('GalleryShowPhotoController', ['$scope', '$stateParams', '$state', 'Gallery', 'Photo',
  function ($scope, $stateParams, $state, Gallery, Photo) {
    var vm = this;

    console.log("$stateParams:", $stateParams);

  }]);
