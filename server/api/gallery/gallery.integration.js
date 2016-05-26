'use strict';

import app from '../..';
import User from '../user/user.model';
import Gallery from '../gallery/gallery.model';
import request from 'supertest';


describe('Gallery API:', function() {
  var newGallery, token;
  var date = new Date();

  // clear users and create new user for testing
  before(function() {
    return User.remove().then(function() {
      var user = new User({
        name: 'inttest',
        email: 'inttest@example.com',
        password: '12qw34er'
      });

      return user.save();
    });
  });

  // log in to get token
  before(function(done) {
    request(app)
      .post('/auth/local')
      .send({
        email: 'inttest@example.com',
        password: '12qw34er'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  // clear galleries
  before(function() {
    return Gallery.remove();
  });

  // clear users
  after(function() {
    return User.remove();
  });

  // clear galleries
  after(function() {
    return Gallery.remove();
  });


  describe('GET /api/gallery', function() {
    var galleries;

    before(function(done) {
      request(app)
        .get('/api/gallery')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          galleries = res.body;
          done();
        });
    });

    it('should respond array with length 0', function() {
      galleries.should.be.instanceOf(Array);
      galleries.should.have.length(0);
    });
  });

  describe('POST /api/gallery', function() {

    before(function(done) {
      request(app)
        .post('/api/gallery')
        .set('authorization', 'Bearer ' + token)
        .send({
          location: 'Test gallery location',
          description: 'This is the brand new gallery description',
          timeframeTo: date,
          timeframeFrom: date
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

    it('should respond with new gallery', function() {
      newGallery.location.should.equal('Test gallery location');
      newGallery.description.should.equal('This is the brand new gallery description');
    });

  });

  describe('GET /api/gallery', function() {
    var galleries;

    before(function(done) {
      request(app)
        .get('/api/gallery')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          galleries = res.body;
          done();
        });
    });

    it('should respond array with length 1', function() {
      galleries.should.be.instanceOf(Array);
      galleries.should.have.length(1);
    });
  });

  describe('GET /api/gallery/:id', function() {
    var gallery;

    before(function(done) {
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

    it('should respond with the requested gallery', function() {
      gallery.location.should.equal('Test gallery location');
      gallery.description.should.equal('This is the brand new gallery description');
    });
  });

  describe('PUT /api/gallery/:id', function() {
    var updatedGallery;

    before(function(done) {
      request(app)
        .put('/api/gallery/' + newGallery._id)
        .set('authorization', 'Bearer ' + token)
        .send({
          location: 'Updated test gallery location',
          description: 'This is the updated gallery description'
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

    it('should respond with the updated gallery', function() {
      updatedGallery.location.should.equal('Updated test gallery location');
      updatedGallery.description.should.equal('This is the updated gallery description');
    });

  });

  describe('DELETE /api/gallery/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/gallery/' + newGallery._id)
        .set('authorization', 'Bearer ' + token)
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
        .set('authorization', 'Bearer ' + token)
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
