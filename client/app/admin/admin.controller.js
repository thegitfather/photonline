'use strict';

(function() {

class AdminController {
  constructor(User, $http) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    this.$http = $http;
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }

  cleanDatabse() {
    // TODO: refactor to service
    this.$http({
      method: 'POST',
      url: '/api/admin/cleanDB'
    }).then(function(res) {
      if (Array.isArray(res.data)) {
        res.data.forEach(function(value) {
          console.info("deleting:\n", value);
        });
      }
    });
  }
}

angular.module('photonlineApp.admin')
  .controller('AdminController', AdminController);

})();
