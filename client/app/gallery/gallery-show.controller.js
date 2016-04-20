'use strict';

angular.module('photoboxApp')
  .controller('GalleryShowController', ['$scope', '$stateParams', 'Gallery', 'Photo', 'ngDialog', function ($scope, $stateParams, Gallery, Photo, ngDialog) {
    var vm = this;
    vm.photos = [];

    vm.ngDialog = ngDialog;

    Gallery.get({ id: $stateParams.id }).$promise.then(function(galleryData) {
      vm.gallery = galleryData;
      vm.photos = galleryData.photo_ids; // holds just the photo IDs for now

      vm.photos.map(function(curVal) {
        Photo.get({ id: curVal }).$promise.then(function(photoData) {
          vm.photos.push(photoData); // push complete photo object
          vm.photos.shift(); // remove first array element
        });
      });
    });

  }]);
