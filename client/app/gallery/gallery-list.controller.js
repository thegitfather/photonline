'use strict';

angular.module('photoboxApp')
  .controller('GalleryListController', ['$scope', 'Gallery', 'User', '$q', '_', function ($scope, Gallery, User, $q, _) {
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
      var relevantUsers = [], i;
      vm.galleries = data;

      // push user_ids for all galleries into array
      for (i = 0; i < vm.galleries.length; i++) {
        relevantUsers.push(vm.galleries[i].user_id);
      }
      // make array unique
      relevantUsers = _.uniq(relevantUsers);
      // replace user_ids with user promise
      for (i = 0; i < relevantUsers.length; i++) {
        relevantUsers[i] = User.get({id: relevantUsers[i]}).$promise.catch(angular.noop);
      }

      // set user_name for every gallery
      $q.all(relevantUsers).then(function (users) {
        for (i = 0; i < vm.galleries.length; i++) {
          var temp = findUserWithId(vm.galleries[i].user_id);
          if (temp !== undefined) {
            vm.galleries[i].user_name = temp.name;
          } else {
            vm.galleries[i].user_name = "[unknown user_id]";
          }
        }

        // set values for username filter
        for (i = 0; i < users.length; i++) {
          if (users[i] !== undefined) {
            vm.usernames.push(users[i].name);
          }
        }
        vm.usernames.sort();

        function findUserWithId(id) {
          var user = _.find(users, function(o) {
            if (o !== undefined) {
              return o.id === id;
            }
          });
          return user;
        }
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
