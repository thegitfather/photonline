'use strict';

angular.module('photoboxApp')
  .controller('GalleryCreateController', ['$scope', '$state', 'FileUploader', '$cookies', '$http', 'appConfig', 'fileMd5Service',
  function ($scope, $state, FileUploader, $cookies, $http, appConfig, fileMd5Service) {
    var vm = $scope;
    var gallery = {};

    var xsrfToken = $cookies.get("XSRF-TOKEN");
    var authToken = 'Bearer ' + $cookies.get("token");

    // vm.formError = [];

    vm.uploader = new FileUploader({
      url: '/api/photo',
      alias: 'photo',
      queueLimit: appConfig.uploadLimits.queueLimit,
      headers : {
        'X-XSRF-TOKEN': xsrfToken,
        'Authorization': authToken
      }
    });

    vm.name = 'some gallery name';

    vm.uploader.filters.push({
      name: 'jpegs-only',
      fn: function (item) {
        var isJpeg = (/image\/jpeg/i).test(item.type);
        var sizeRange = (item.size <= appConfig.uploadLimits.maxFileSize && item.size >= appConfig.uploadLimits.minFileSize);
        // console.log("item:", item, isJpeg, sizeRange);
        if ( isJpeg && sizeRange ) {
          return true;
        }
        return false;
      }
    });

    vm.uploader.onAfterAddingFile = function (item) {
      // console.log("item:", item);
      if (window.FileReader && window.FileReader.prototype.readAsArrayBuffer) {
        var md5sum = getMd5Sum(item);
        md5sum.progress(function(stats) {
          console.info('Hashed ' + stats.loaded + ' B out of ' + stats.total + ' B');
        })
        .error(function(error) {
          console.error('Error calculating md5: %o', error);
        }).success(function(md5sum) {
          // if (photosMd5.indexOf(md5sum) === -1) {
          //   photosMd5.push(md5sum);
          // } else {
          //   item.remove();
          // }
          // console.info("MD5 '%s':", item._file.name, md5sum);

          item.formData.push({ md5: md5sum });
          item.formData.push({ originalFilename: item._file.name });
        });
      } else {
        console.info('The FileReader readAsArrayBuffer API is not supported');
        // TODO: calc md5 on server, update db and move to /uploads/pool
        item.formData.push({ md5: "unset", originalFilename: item._file.name });
        item.file.name = "tmp_" + getRandomHash(16) + ".jpg";
      }
    };

    vm.createGallery = function () {
      if(vm.uploader.queue.length < 1) {
        vm.formErrors = [];
        // TODO: watch formError array to re-validate
        vm.formErrors.push(new Error("No images selected!"));
        return; // stop here
      }

      gallery.name = vm.name;

      $http.post("/api/gallery", gallery).then(response => {
        var galleryId = response.data._id;

        vm.uploader.onBeforeUploadItem = function(item) {
          item.formData.push({ position: vm.uploader.getIndexOfItem(item) });
          item.formData.push({ gallery_id: galleryId });
        };

        // change state to show new gallery
        vm.uploader.onCompleteAll = function() {
          $state.go("gallery.show", { id: galleryId });
        };

        vm.uploader.uploadAll();
      }, errorMsg => {
        // TODO: display error msg in scope
        console.log("errorMsg:", errorMsg);
      }
    );

  };

  var getMd5Sum = function (item) {
    return fileMd5Service.md5(item._file);
  };

  var getRandomHash = function (count) {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '', i;
    for (i = 0; i < count; i++) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
  };

}]);
