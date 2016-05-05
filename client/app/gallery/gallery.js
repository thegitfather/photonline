'use strict';

angular.module('photonlineApp')
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
    authenticate: true
  })
  .state('gallery.show', {
    url: '/:id?photo',
    templateUrl: 'app/gallery/gallery-show.view.html',
    controller: 'GalleryShowController',
    controllerAs: 'vm',
    reloadOnSearch: false,
    resolve: {
      galleryObj: function(Gallery, $stateParams) {
        return Gallery.get({ id: $stateParams.id }).$promise;
      },
      galleryPhotos: function(galleryObj, Photo) {
        return Promise.all(galleryObj.photo_ids.map(getPhotoPromise));

        function getPhotoPromise(photoId) {
          return Photo.get({ id: photoId }).$promise;
        }
      }
    }
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
