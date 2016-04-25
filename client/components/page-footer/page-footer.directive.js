'use strict';

angular.module('photonlineApp').directive('pageFooter', function() {
  return {
    templateUrl: 'components/page-footer/page-footer.html',
    restrict: 'E',
    replace: true,
    link: function(scope, element) {
      element.addClass('page-footer');
    }
  };
});
