'use strict';

angular.module('photoboxApp')
  .controller('GalleryCreateController', ['$scope', '$state', 'Upload', '$cookies', '$http', 'appConfig', 'fileMd5Service',
  function ($scope, $state, Upload, $cookies, $http, appConfig, fileMd5Service) {
    var vm = this;
    var gallery = {};
    var galleryId;
    var curUpload;

    vm.files = [];

    Upload.setDefaults({
      ngfMinSize: appConfig.uploadLimits.minFileSize,
      ngfMaxSize: appConfig.uploadLimits.maxFileSize,
      ngfMaxFiles: appConfig.uploadLimits.queueLimit,
      ngfPattern: "'.jpg, .jpeg'",
      ngfAccept: "'image/jpeg'",
      ngfMultiple: "true",
      ngfKeep: "'distinct'"
    });



    $scope.$watchCollection('vm.files', function(newCol, oldCol) {
      // console.log("vm.files.length:", vm.files.length);
      if (vm.files && vm.files.length) {
        for (var i = 0; i < vm.files.length; i++) {
          if (vm.files[i].md5 === undefined) {
            addMd5sum(vm.files[i]);
          }
          console.log("vm.files[i]:", vm.files[i]);
        }
      }
    });

    // vm.formError = [];

    vm.upload = function(file) {
      curUpload = Upload.upload({
        url: '/api/photo?md5=' + file.md5,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: {
          // photo: Upload.rename(file, file.md5 + '.jpg'),
          photo: file,
          md5: file.md5,
          gallery_id: galleryId,
          position: file.position,
          originalFilename: file.name
        }
      }).then(function(res) {
        console.log("Successfully uploaded %s - res.data:", res.config.data.photo.name, res.data);
      }, function(res) {
        console.log('Error status: ' + res.status);
      }, function(event) {
        var progressPercentage = parseInt(100.0 * event.loaded / event.total);
        console.log('progress: ' + progressPercentage + '% ' + event.config.data.photo.name);
      });
    };

    vm.submit = function(form) {
      // console.log("form:", form);
      if (form.$valid) {
        gallery.name = vm.galleryName;
        gallery.location = vm.location;

        $http.post("/api/gallery", gallery).then(response => {
          galleryId = response.data._id;

          for (var i = 0; i < vm.files.length; i++) {
            vm.files[i].position = i;
            vm.upload(vm.files[i]);

            // change state when last upload promise is fulfilled
            if (i === vm.files.length-1) {
              curUpload.then(function(result) {
                // console.info("all uploaded");
                $state.go("gallery.show", { id: galleryId });
              });
            }
          }

        }, errorMsg => {
          // TODO: display error msg in scope
          console.log("errorMsg:", errorMsg);
        });
      }
    };

    function addMd5sum(file) {
      if (window.FileReader && window.FileReader.prototype.readAsArrayBuffer) {
        var md5sum = fileMd5Service.md5(file); // returns promise
        md5sum.progress(function(stats) {
          console.info('Hashed ' + stats.loaded + ' B out of ' + stats.total + ' B');
        })
        .error(function(error) {
          console.error('Error calculating md5: %o', error);
        }).success(function(md5sum) {
          // item.formData.push({ originalFilename: item._file.name });
          console.log("md5sum:", md5sum);
          file.md5 = md5sum;
          // TODO: check if md5 is in database here
        });
      } else {
        console.info('The FileReader readAsArrayBuffer API is not supported');
        // TODO: calc md5 on server, update db and move to /uploads/pool
      }
    }

  }]);
