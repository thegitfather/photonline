'use strict';

angular.module('photoboxApp')
  .directive('uploadList', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/upload-list/upload-list.html',
      replace: true,
      scope: {
        'files': '=',
        'invalidFiles': '=',
        'myFunc': '&fooBar',
        'fooBar': '&'
      },
      link: function(scope, $element, attrs) {

        // var testObj = {someVal: "blubXXX", anotherVal: "blubYYY"};
        // console.log("scope.myFunc:", scope.myFunc);
        // scope.myFunc({val: testObj});
        // scope.fooBar({val: testObj});


        // TODO: add to global helper functions?
        scope.convertBytesToKB = function(value) {
          return Math.floor(value / 1024);
        };

        scope.removeFile = function(index) {
          scope.files.splice(index, 1);
        };

      }
    };
  });
