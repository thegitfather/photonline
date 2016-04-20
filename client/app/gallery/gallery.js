'use strict';

angular.module('photoboxApp')
.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('gallery', {
    abstract: true,
    url: '/gallery',
    template: '<section ui-view />'
  })
  .state('gallery.list', {
    url: '/list',
    templateUrl: 'app/gallery/gallery-list.view.html',
    controller: 'GalleryListController',
    controllerAs: 'vm'
  })
  .state('gallery.create', {
    url: '/create',
    templateUrl: 'app/gallery/gallery-create.view.html',
    controller: 'GalleryCreateController',
    controllerAs: 'vm',
    authenticate: true,
    resolve: {
      location: function (geoLocation) {
        return geoLocation;
      }
    }
  })
  .state('gallery.show', {
    url: '/:id',
    templateUrl: 'app/gallery/gallery-show.view.html',
    controller: 'GalleryShowController',
    controllerAs: 'vm'
  });

  // $urlRouterProvider.otherwise('/gallery/create');
})
.run(['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    // console.info("$stateChangeStart event:", event);
    // console.info("fromState:", fromState);

    if (toState.redirectTo) {
      event.preventDefault();
      $state.go(toState.redirectTo, toParams);
    }
  });

}]);
