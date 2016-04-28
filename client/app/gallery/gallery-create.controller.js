'use strict';

angular.module('photonlineApp')
  .controller('GalleryCreateController', ['$scope', '$state', 'Upload', '$http', '$q', 'appConfig', 'fileMd5Service', '_',
  function ($scope, $state, Upload, $http, $q, appConfig, fileMd5Service, _) {
    var vm = this;
    vm.Upload = Upload;

    vm.files = [];
    vm.busy = false;
    $scope.queueInvalidLength = 0;

    Upload.setDefaults({
      ngfMinSize: appConfig.uploadLimits.minFileSize,
      ngfMaxSize: appConfig.uploadLimits.maxFileSize,
      ngfMaxFiles: appConfig.uploadLimits.queueLimit,
      ngfPattern: "'.jpg,.jpeg'",
      ngfAccept: "'image/jpeg'",
      ngfMultiple: "true",
      ngfKeep: "'distinct'",
      ngfMinRatio: "1:2.01",
      ngfMaxRatio: "16.01:9",
      ngfMinWidth: "400",
      ngfMaxWidth: "4400",
      ngModelOptions: { allowInvalid: true }
    });

    // TODO: vendor-b47e96d874.js:2 Mixed Content: The page at 'https://photonline.joinpoint.org/gallery/list' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://ip-api.com/json'. This request has been blocked; the content must be served over HTTPS.
    // if (appConfig.geoLocation !== undefined && appConfig.geoLocation.hasOwnProperty("country")) {
    //   vm.locationPlaceholder = appConfig.geoLocation.country + ", " + appConfig.geoLocation.city;
    // } else {
    //   vm.locationPlaceholder = "USA, New York";
    // }
    vm.locationPlaceholder = "Germany, Berlin";

    $scope.$watchCollection('vm.files', function(newVal, oldVal) {
      // console.log("newVal:", newVal);
      vm.busy = true;
      var fileErrors = 0;
      for (var i = 0; i < newVal.length; i++) {
        if (newVal[i].dimensions === undefined) {
          // TODO: https://github.com/danialfarid/ng-file-upload/issues/1490
          // appendDimensions(newVal[i]);
        }
        if (newVal[i].$error !== undefined) {
          fileErrors += 1;
        }
      }
      $scope.queueInvalidLength = fileErrors;

      // check if browser can calc md5
      if (window.FileReader && window.FileReader.prototype.readAsArrayBuffer) {
        var md5Promises = [];
        var diffArr = _.difference(newVal, oldVal);

        for (var j = 0; j < diffArr.length; j++) {
          if (diffArr[j].md5 === undefined) {
            md5Promises.push(getMd5sum(diffArr[j]));
          }
        }

        $q.all(md5Promises).then(function(values) {
          var md5Arr = [];
          md5Arr = _.union(values, md5Arr);
          removeDuplicates(md5Arr);
          markServerDuplicates();
          vm.busy = false;
        });
      }
      else {
        console.info('The FileReader readAsArrayBuffer API is not supported');
      }
    });

    // workaround: ngFileUpload elements will not be valid after dropping invalid files
    $scope.$watch('queueInvalidLength', function(newVal, oldVal) {
      setValid( [vm.form.fileDropArea, vm.form.fileSelectInput] );
    });

    // TODO: window.onbeforeunload = "Are you sure you want to leave?";
    // window.onbeforeunload = null;

    vm.submit = function(form) {
      if (form.$valid && vm.files.length > $scope.queueInvalidLength) {
        var gallery = {};
        gallery.location = vm.location;
        gallery.timeframeFrom = vm.timeframeFrom;
        gallery.timeframeTo = vm.timeframeTo;
        gallery.description = vm.description;

        $http.post("/api/gallery", gallery).then(response => {
          var galleryId = response.data._id,
          uploadPromises = [],
          i, pos = 0;

          vm.busy = true;

          for (i = 0; i < vm.files.length; i++) {
            if (vm.files[i].$error === undefined) {
              vm.files[i].position = pos++;
              uploadPromises.push(upload(vm.files[i], galleryId));
            }
          }

          // change state when all upload promise are fulfilled
          $q.all(uploadPromises).then(function(values) {
            // TODO: DB is not ready yet when all photos in list already on server
            // (some image are missing... -> F5)
            $state.go("gallery.show", { id: galleryId });
          });

        }, function(errorMsg) {
          // TODO: display error msg in scope
          console.error("errorMsg:", errorMsg);
        });
      }
    };

    vm.syncDate = function(date) {
      try {
        date = new Date(date).toISOString();
        if (vm.timeframeTo === undefined) {
          vm.timeframeTo = date;
        }
      }
      catch (e) {
        if (e instanceof RangeError) {
          console.log("date range error");
        }
      }
    };

    // TODO:
    // vm.abortAll = function() {}

    function setValid(formElements) {
      for (var i = 0; i < formElements.length; i++) {
        if (formElements[i] !== undefined) {
          angular.forEach(formElements[i].$error, function(value, key, element) {
            formElements[i].$setValidity(key, true);
          });
        }
      }
    }

    function removeDuplicates(uniqueMd5Arr) {
      var foundDup, i, j;
      for (i = 0; i < uniqueMd5Arr.length; i++) {
        foundDup = false;
        for (j = 0; j < vm.files.length; j++) {
          // first occurrance is ok
          if (foundDup && vm.files[j].md5 === uniqueMd5Arr[i]) {
            vm.files.splice(j, 1);
            j--;
          }
          if (vm.files[j].md5 === uniqueMd5Arr[i]) {
            foundDup = true;
          }
        }
      }
    }

    function markServerDuplicates() {
      var checkPhotoPromises = [];
      vm.busy = true;
      for (var i = 0; i < vm.files.length; i++) {
        if (vm.files[i].md5 !== undefined) {
          checkPhotoPromises.push( checkPhoto(vm.files[i]) );
        }
      }

      $q.all(checkPhotoPromises).then(function() {
        vm.busy = false;
      });

      function checkPhoto(file) {
        // TODO: refactor REST calls to service
        return $http({
          method: 'GET',
          url: '/api/photo/check/' + file.md5
        }).then(function(res) {
          // console.log("res.data.fileAlreadyExists:", res.data.fileAlreadyExists);
          // console.log("file:", file);
          if (res.data.fileAlreadyExists) {
            file.fileAlreadyExists = true;
          } else {
            file.fileAlreadyExists = false;
          }
        });
      }
    }

    function upload(file, galleryId) {
      var uploadData = {
        photo: file,
        md5: file.md5,
        gallery_id: galleryId,
        position: file.position,
        originalFilename: file.name,
        size: file.size
      };

      if (!file.fileAlreadyExists) {
        return Upload.upload({
          url: '/api/photo/' + file.md5,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: uploadData
        }).then(function(res) {
          console.log("Successfully uploaded", file.name);
          // console.log("res.data:", res.data);
        }, function(res) {
          console.error('Error status: ' + res.status);
        }, function(event) {
          var progressPercentage = parseInt(100.0 * event.loaded / event.total);
          // console.log('progress: ' + progressPercentage + '% ' + event.config.data.photo.name);
          file.progress = progressPercentage;
        });
      }

      if (file.fileAlreadyExists) {
        return $http({
          method: 'POST',
          url: '/api/photo/' + file.md5,
          data: uploadData
        });
      }

    }

    function appendDimensions(file) {
      Upload.imageDimensions(file).then(function(dimensions) {
        file.dimensions = dimensions;
      });
    }

    function getMd5sum(file) {
      var md5sum = fileMd5Service.md5(file); // returns promise
      md5sum.progress(function(stats) {
        console.info('Hashed ' + stats.loaded + ' B out of ' + stats.total + ' B');
      })
      .error(function(error) {
        console.error('Error calculating md5: %o', error);
      }).success(function(md5sum) {
        console.info("md5sum for %s:", file.name, md5sum);
        file.md5 = md5sum;
        // TODO: check if md5 is in database here
      });
      return md5sum; // promise
    }

  }]);
