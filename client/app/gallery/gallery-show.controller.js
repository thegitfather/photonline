'use strict';

angular.module('photonlineApp')
  .controller('GalleryShowController', ['$scope', '$stateParams', '$state', 'Auth', 'Gallery', 'galleryObj', 'galleryPhotos', 'ngDialog', '_',
  function ($scope, $stateParams, $state, Auth, Gallery, galleryObj, galleryPhotos, ngDialog, _) {
    var vm = this;
    vm.photos = galleryPhotos;
    vm.gallery = galleryObj;

    if (Auth.isLoggedIn()) {
      checkOwner(galleryObj.user_id);
    }

    vm.checkUrlQueryParam = function() {
      if ($stateParams.photo !== undefined) {
        var photo = _.find(galleryPhotos, function(o) {
          if (o.position.toString() === $stateParams.photo) {
            return o;
          }
        });
        var target = document.getElementById( "gallery-item-" + parseInt(photo.position) );
        target = angular.element(target).scope();
        openDialog(target);
      }
    };

    function checkOwner(id) {
      Auth.getCurrentUser().$promise.then(function(user) {
        if (user._id === id) {
          vm.userIsOwner = true;
        }
      });
    }

    function openDialog(galleryItemScope) {
      var dialog, dialogIsOpen = !!(ngDialog.getOpenDialogs().length);
      var $overlay = angular.element('<div class="ngdialog-overlay"></div>');

      var ngDialogOptions = {
        template: 'app/gallery/gallery-item/photo.template.html',
        scope: galleryItemScope,
        className: 'ngdialog-theme-photonline',
        closeByNavigation: true,
        overlay: false
      };

      vm.poolImgReady = false;
      vm.nextElementScope = angular.element(document.getElementById( "gallery-item-" + parseInt(galleryItemScope.photo.position + 1) )).scope();
      vm.prevElementScope = angular.element(document.getElementById( "gallery-item-" + parseInt(galleryItemScope.photo.position - 1) )).scope();

      if (dialogIsOpen) {
        ngDialog.closeAll();
      } else {
        angular.element(document.body).append($overlay);
        angular.element(document).on("keydown", addKeydownEvents);
        $overlay.on("click", function() {
          ngDialog.closeAll();
        });
      }

      dialog = ngDialog.open(ngDialogOptions);

      dialog.closePromise.then(function() {
        // remove url query param
        if (ngDialog.getOpenDialogs().length === 0) {
          $state.go($state.current, { photo: null }, { location: "replace" });
          var overlay = document.body.getElementsByClassName("ngdialog-overlay");
          document.body.removeChild(overlay[0]);
          angular.element(document).unbind("keydown");
        }
      });

      // change url query parameter but don't save history
      $state.go($state.current, { photo: galleryItemScope.photo.position }, { location: "replace" });

      function addKeydownEvents(e) {
        e.preventDefault();
        var controls, nextBtn, prevBtn;
        controls = document.getElementsByClassName("ngdialog")[0].getElementsByClassName("controls")[0];
        nextBtn = controls.querySelectorAll('a.next')[0];
        prevBtn = controls.querySelectorAll('a.prev')[0];
        // arrow-right, page-down
        if (e.keyCode === 39 || e.keyCode === 34) {
          nextBtn.click();
        }
        // arrow-left, page-up
        if (e.keyCode === 37 || e.keyCode === 33) {
          prevBtn.click();
        }
      }
    }

    vm.openDialog = openDialog;

    function preload(scopes) {
      for (var i = 0; i < scopes.length; i++) {
        if (scopes[i] !== undefined) {
          angular.element('<img src="' + scopes[i].photo.path + scopes[i].photo.filename +'">');
        }
      }
    }

    vm.openNext = function() {
      if (vm.nextElementScope !== undefined) {
        openDialog(vm.nextElementScope);
      }
    };

    vm.openPrev = function() {
      if (vm.prevElementScope !== undefined) {
        openDialog(vm.prevElementScope);
      }
    };

    vm.onPoolImgLoad = function(event) {
      var $img = angular.element(event.target);
      var ratio = $img[0].naturalWidth / $img[0].naturalHeight;

      // if img is upright then limit height to viewport
      if (ratio < 1) {
        $img.css("max-height", document.documentElement.clientHeight * 0.9 + "px");
      }
      vm.poolImgReady = true;
      preload([vm.nextElementScope, vm.prevElementScope]);
    };

    vm.delete = function() {
      // TODO: use ngDialog for confirmation
      if (window.confirm("Do you really want to delete this gallery?")) {
        // TODO: check user is owner on server side!
        Gallery.delete({ id: $stateParams.id }).$promise.then(function() {
          console.info("gallery with id %s deleted", $stateParams.id);
          $state.go("gallery.list");
        });
      }
    };

  }]);
