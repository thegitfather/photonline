'use strict';

angular.module('photonlineApp')
  .controller('GalleryShowController', ['$scope', '$stateParams', '$state', 'Auth', 'Gallery', 'Photo', 'ngDialog',
  function ($scope, $stateParams, $state, Auth, Gallery, Photo, ngDialog) {
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

      if (Auth.isLoggedIn()) {
        checkOwner(galleryData.user_id);
      }
    });

    function checkOwner(id) {
      Auth.getCurrentUser().$promise.then(function(user) {
        if (user._id === id) {
          vm.userIsOwner = true;
        }
      });
    }

    vm.delete = function() {
      // TODO: use ngDialog for confirmation
      if (window.confirm("Do you really want to delete this gallery?")) {
        // TODO: check user is owner on server side!
        Gallery.delete({ id: $stateParams.id }).$promise.then(function(galleryData) {
          console.info("gallery with id %s deleted", $stateParams.id);
          $state.go("gallery.list");
        });
      }
    };

  }]);
