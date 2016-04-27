'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var adminCtrlStub = {
  index: 'adminCtrl.index',
  show: 'adminCtrl.show',
  create: 'adminCtrl.create',
  update: 'adminCtrl.update',
  destroy: 'adminCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var adminIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './admin.controller': adminCtrlStub
});

describe('Admin API Router:', function() {

  it('should return an express router instance', function() {
    adminIndex.should.equal(routerStub);
  });

  describe('GET /api/admin', function() {

    it('should route to admin.controller.index', function() {
      routerStub.get
        .withArgs('/', 'adminCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/admin/:id', function() {

    it('should route to admin.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'adminCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/admin', function() {

    it('should route to admin.controller.create', function() {
      routerStub.post
        .withArgs('/', 'adminCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/admin/:id', function() {

    it('should route to admin.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'adminCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/admin/:id', function() {

    it('should route to admin.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'adminCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/admin/:id', function() {

    it('should route to admin.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'adminCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
