'use strict';

angular.module('photoboxApp')
  .controller('GalleryCreateController', ['$scope', '$state', 'Upload', '$cookies', '$http', '$q', 'appConfig', 'fileMd5Service', '_',
  function ($scope, $state, Upload, $cookies, $http, $q, appConfig, fileMd5Service, _) {
    var vm = this;
    var gallery = {};
    var galleryId;

    vm.Upload = Upload;
    $scope.files = [];
    vm.invalidFiles = [];

    Upload.setDefaults({
      ngfMinSize: appConfig.uploadLimits.minFileSize,
      ngfMaxSize: appConfig.uploadLimits.maxFileSize,
      ngfMaxFiles: appConfig.uploadLimits.queueLimit,
      ngfPattern: "'.jpg,.jpeg'",
      ngfAccept: "'image/jpeg'",
      ngfMultiple: "true",
      ngfKeep: "'distinct'"
    });

    $scope.$watchCollection('files', function(newVal, oldVal) {
      console.log("watchCollection()");
      if (window.FileReader && window.FileReader.prototype.readAsArrayBuffer) {
        var md5Promises = [];
        var diffArr = _.difference(newVal, oldVal);

        for (var i = 0; i < diffArr.length; i++) {
          if (diffArr[i].md5 === undefined) {
            md5Promises.push(getMd5sum(diffArr[i]));
          }
        }

        $q.all(md5Promises).then(function(values) {
          var md5Arr = [];
          md5Arr = _.union(values, md5Arr);
          removeDuplicates(md5Arr);
          markServerDuplicates();
        });
      }
      else {
        console.info('The FileReader readAsArrayBuffer API is not supported');
      }
      console.log("$scope.files:", $scope.files);
    });

    function removeDuplicates(uniqueMd5Arr) {
      var foundDup, i, j;
      for (i = 0; i < uniqueMd5Arr.length; i++) {
        foundDup = false;
        for (j = 0; j < $scope.files.length; j++) {
          // first occurrance is ok
          if (foundDup && $scope.files[j].md5 === uniqueMd5Arr[i]) {
            $scope.files.splice(j, 1);
            j--;
          }
          if ($scope.files[j].md5 === uniqueMd5Arr[i]) {
            foundDup = true;
          }
        }
      }
    }

    function markServerDuplicates() {
      var i;
      for (i = 0; i < $scope.files.length; i++) {
        if ($scope.files[i].md5 !== undefined) {
          markFile($scope.files[i]);
        }
      }

      function markFile(file) {
        $http({
          method: 'GET',
          url: '/api/photo/check/' + file.md5
        }).then(function(res) {
          // console.log("res.data.fileAlreadyExists:", res.data.fileAlreadyExists);
          console.log("file:", file);
          if (res.data.fileAlreadyExists) {
            file.fileAlreadyExists = true;
          } else {
            file.fileAlreadyExists = false;
          }
        });
      }
    }

    // vm.formError = [];

    var upload = function(file) {
      if (!file.fileAlreadyExists) {
        return Upload.upload({
          url: '/api/photo/' + file.md5,
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
            originalFilename: file.name,
            size: file.size
          }
        }).then(function(res) {
          console.log("Successfully uploaded", file.name);
          // console.log("res.data:", res.data);
        }, function(res) {
          console.log('Error status: ' + res.status);
        }, function(event) {
          var progressPercentage = parseInt(100.0 * event.loaded / event.total);
          // console.log('progress: ' + progressPercentage + '% ' + event.config.data.photo.name);
          file.progress = progressPercentage;
        });
      }

      if (file.fileAlreadyExists) {
        var data = {
          photo: file,
          md5: file.md5,
          gallery_id: galleryId,
          position: file.position,
          originalFilename: file.name,
          size: file.size
        };
        $http({
          method: 'POST',
          url: '/api/photo/' + file.md5,
          data: data
        }).then(function(res) {
          console.log("res:", res);
        });

        // $http.post("/api/photo", data).then(response => {
        //   console.log("response:", response);
        // });
      }

    };

    vm.submit = function(form) {
      // console.log("form:", form);
      var uploadPromises = [];

      if ($scope.files.length > 0) {
        // if files in queue set pattern to valid so the form is valid
        form.fileDropArea.$setValidity("pattern", true);
      }
      if (form.$valid) {
        gallery.name = vm.galleryName;
        gallery.location = vm.location;

        $http.post("/api/gallery", gallery).then(response => {
          galleryId = response.data._id;

          for (var i = 0; i < $scope.files.length; i++) {
            $scope.files[i].position = i;
            uploadPromises.push(upload($scope.files[i]));
          }

          // change state when all upload promise are fulfilled
          $q.all(uploadPromises).then(function(values) {
            $state.go("gallery.show", { id: galleryId });
          });

        }, function(errorMsg) {
          // TODO: display error msg in scope
          console.error("errorMsg:", errorMsg);
        });
      }
    };

    function getMd5sum(file) {
      var md5sum = fileMd5Service.md5(file); // returns promise
      md5sum.progress(function(stats) {
        console.info('Hashed ' + stats.loaded + ' B out of ' + stats.total + ' B');
      })
      .error(function(error) {
        console.error('Error calculating md5: %o', error);
      }).success(function(md5sum) {
        console.log("md5sum:", md5sum);
        file.md5 = md5sum;
        // TODO: check if md5 is in database here
      });
      return md5sum; // promise
    }

    vm.abortAll = function() {

    }

  }]);
