'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var photoCtrlStub = {
  index: 'photoCtrl.index',
  show: 'photoCtrl.show',
  create: 'photoCtrl.create',
  update: 'photoCtrl.update',
  destroy: 'photoCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var photoIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './photo.controller': photoCtrlStub
});

describe('Photo API Router:', function() {

  it('should return an express router instance', function() {
    photoIndex.should.equal(routerStub);
  });

  describe('GET /api/photo', function() {

    it('should route to photo.controller.index', function() {
      routerStub.get
        .withArgs('/', 'photoCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/photo/:id', function() {

    it('should route to photo.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'photoCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/photo', function() {

    it('should route to photo.controller.create', function() {
      routerStub.post
        .withArgs('/', 'photoCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/photo/:id', function() {

    it('should route to photo.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'photoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/photo/:id', function() {

    it('should route to photo.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'photoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/photo/:id', function() {

    it('should route to photo.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'photoCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
