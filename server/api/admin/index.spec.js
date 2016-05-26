'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var adminCtrlStub = {
  cleanDB: 'adminCtrl.cleanDB'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return 'authService.hasRole.' + role;
  }
};

var routerStub = {
  post: sinon.spy()
};

// require the index with our stubbed out modules
var adminIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './admin.controller': adminCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Admin API Router:', function() {

  it('should return an express router instance', function() {
    adminIndex.should.equal(routerStub);
  });

  describe('POST /api/admin/cleanDB', function() {

    it('should route to admin.controller.cleanDB', function() {
      routerStub.post
        .withArgs('/cleanDB', 'authService.hasRole.admin', 'adminCtrl.cleanDB')
        .should.have.been.calledOnce;
    });

  });

});
