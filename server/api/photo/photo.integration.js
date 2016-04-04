'use strict';

var app = require('../..');
import request from 'supertest';

var newPhoto;

describe('Photo API:', function() {

  describe('GET /api/photo', function() {
    var photos;

    beforeEach(function(done) {
      request(app)
        .get('/api/photo')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          photos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      photos.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/photo', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/photo')
        .send({
          name: 'New Photo',
          info: 'This is the brand new photo!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPhoto = res.body;
          done();
        });
    });

    it('should respond with the newly created photo', function() {
      newPhoto.name.should.equal('New Photo');
      newPhoto.info.should.equal('This is the brand new photo!!!');
    });

  });

  describe('GET /api/photo/:id', function() {
    var photo;

    beforeEach(function(done) {
      request(app)
        .get('/api/photo/' + newPhoto._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          photo = res.body;
          done();
        });
    });

    afterEach(function() {
      photo = {};
    });

    it('should respond with the requested photo', function() {
      photo.name.should.equal('New Photo');
      photo.info.should.equal('This is the brand new photo!!!');
    });

  });

  describe('PUT /api/photo/:id', function() {
    var updatedPhoto;

    beforeEach(function(done) {
      request(app)
        .put('/api/photo/' + newPhoto._id)
        .send({
          name: 'Updated Photo',
          info: 'This is the updated photo!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPhoto = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPhoto = {};
    });

    it('should respond with the updated photo', function() {
      updatedPhoto.name.should.equal('Updated Photo');
      updatedPhoto.info.should.equal('This is the updated photo!!!');
    });

  });

  describe('DELETE /api/photo/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/photo/' + newPhoto._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when photo does not exist', function(done) {
      request(app)
        .delete('/api/photo/' + newPhoto._id)
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
