'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var galleryCtrlStub = {
  index: 'galleryCtrl.index',
  show: 'galleryCtrl.show',
  create: 'galleryCtrl.create',
  update: 'galleryCtrl.update',
  destroy: 'galleryCtrl.destroy'
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
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var galleryIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './gallery.controller': galleryCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Gallery API Router:', function() {

  it('should return an express router instance', function() {
    galleryIndex.should.equal(routerStub);
  });

  describe('GET /api/gallery', function() {

    it('should route to gallery.controller.index', function() {
      routerStub.get
        .withArgs('/', 'galleryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/gallery/:id', function() {

    it('should route to gallery.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'galleryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/gallery', function() {

    it('should route to gallery.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'galleryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/gallery/:id', function() {

    it('should route to gallery.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'galleryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/gallery/:id', function() {

    it('should route to gallery.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isAuthenticated', 'galleryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
