'use strict';

angular.module('photoboxApp')
  .controller('GalleryController', ['$scope', 'Gallery', 'User', function ($scope, Gallery, User) {
    var vm = this;
    var galleries;

    vm.galleries = [];
    vm.usernames = [];
    vm.filtered = [];

    vm.filterUser = { user_name: "" };
    vm.locationFilter = { location: "" };
    vm.sortOption = '-created_at';

    vm.orderFilter = [
      { label: 'Created at', value: '-created_at' },
      { label: 'Created at (oldest first)', value: 'created_at' },
      { label: 'Timeframe', value: '-timeframeFrom' },
      { label: 'Timeframe (oldest first)', value: 'timeframeFrom' },
      { label: 'User', value: 'user_name' },
      { label: 'User (z-a)', value: '-user_name' },
      { label: 'Location', value: 'location' },
      { label: 'Location (z-a)', value: '-location' }
    ];

    galleries = Gallery.query().$promise;

    galleries.then(function(data) {
      // console.log("data:", data);
      vm.galleries = data;
      vm.galleries.forEach(function(value, index) {
        User.get({id: vm.galleries[index].user_id}).$promise.then(function(user) {
          vm.galleries[index].user_name = user.name;
          if (vm.usernames.indexOf(user.name) === -1) {
            vm.usernames.push(user.name);
            vm.usernames.sort();
          }
        }, function() {
          console.error("User.get() failed!");
        });
      });
    });

    // TODO: pagination

    // reset filter if value is empty/null
    vm.checkForReset = function (filterTemplate) {
      if( filterTemplate.user_name === null || filterTemplate.user_name === undefined) {
        delete filterTemplate.user_name;
      }
    };

  }]);
