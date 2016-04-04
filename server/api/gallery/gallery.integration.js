'use strict';

var app = require('../..');
import request from 'supertest';

var newGallery;

describe('Gallery API:', function() {

  describe('GET /api/gallery', function() {
    var gallerys;

    beforeEach(function(done) {
      request(app)
        .get('/api/gallery')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          gallerys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      gallerys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/gallery', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/gallery')
        .send({
          name: 'New Gallery',
          info: 'This is the brand new gallery!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newGallery = res.body;
          done();
        });
    });

    it('should respond with the newly created gallery', function() {
      newGallery.name.should.equal('New Gallery');
      newGallery.info.should.equal('This is the brand new gallery!!!');
    });

  });

  describe('GET /api/gallery/:id', function() {
    var gallery;

    beforeEach(function(done) {
      request(app)
        .get('/api/gallery/' + newGallery._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          gallery = res.body;
          done();
        });
    });

    afterEach(function() {
      gallery = {};
    });

    it('should respond with the requested gallery', function() {
      gallery.name.should.equal('New Gallery');
      gallery.info.should.equal('This is the brand new gallery!!!');
    });

  });

  describe('PUT /api/gallery/:id', function() {
    var updatedGallery;

    beforeEach(function(done) {
      request(app)
        .put('/api/gallery/' + newGallery._id)
        .send({
          name: 'Updated Gallery',
          info: 'This is the updated gallery!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedGallery = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGallery = {};
    });

    it('should respond with the updated gallery', function() {
      updatedGallery.name.should.equal('Updated Gallery');
      updatedGallery.info.should.equal('This is the updated gallery!!!');
    });

  });

  describe('DELETE /api/gallery/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/gallery/' + newGallery._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when gallery does not exist', function(done) {
      request(app)
        .delete('/api/gallery/' + newGallery._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
