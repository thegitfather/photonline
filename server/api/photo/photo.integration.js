'use strict';

import app from '../..';
import User from '../user/user.model';
import Photo from '../photo/photo.model';
import Gallery from '../gallery/gallery.model';
import request from 'supertest';


describe('Photo API:', function() {
  var token, newPhoto, newGallery, photos;

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
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });

  // create empty gallery
  before(function(done) {
    request(app)
      .post('/api/gallery')
      .set('authorization', 'Bearer ' + token)
      .send({
        location: 'Test gallery location',
        description: 'This is the brand new gallery description',
        timeframeTo: new Date(),
        timeframeFrom: new Date()
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

  // clear photos
  before(function() {
    return Photo.remove();
  });

  // clear users
  after(function() {
    return User.remove();
  });

  // clear photos
  after(function() {
    return Photo.remove();
  });

  // clear galleries
  after(function() {
    return Gallery.remove();
  });


  describe('GET /api/photo', function() {

    before(function(done) {
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

    it('should respond array with length 0', function() {
      photos.should.be.instanceOf(Array);
      photos.should.have.length(0);
    });
  });

  describe('POST /api/photo/:checksum', function() {

    before(function(done) {
      request(app)
        .post('/api/photo/f20353693aa792ed16e393974fb80813')
        .set('authorization', 'Bearer ' + token)
        .attach('photo', './testing/images/dummy-1000x667.jpg')
        .field('gallery_id', newGallery._id)
        .field('size', 22177)
        .field('originalFilename', 'dummy-1000x667.jpg')
        .field('position', 0)
        .field('md5', 'f20353693aa792ed16e393974fb80813')
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

    it('should respond with new photo', function() {
      newPhoto.filename.should.equal(newPhoto.md5 + '.jpg');
    });

  });

  describe('GET /api/photo/check/:checksum', function() {

    it('should respond with fileAlreadyExists = true', function() {
      request(app)
        .get('/api/photo/check/f20353693aa792ed16e393974fb80813')
        // .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.body.fileAlreadyExists.should.equal(true);
        });
    });

  });

  // skip upload
  describe('POST /api/photo/:checksum', function() {

    before(function(done) {
      newPhoto = {};

      request(app)
        .post('/api/photo/f20353693aa792ed16e393974fb80813')
        .set('authorization', 'Bearer ' + token)
        .send({
          'gallery_id': newGallery._id,
          'size': 22177,
          'originalFilename': 'dummy-1000x667.jpg',
          'position': 0,
          'md5': 'f20353693aa792ed16e393974fb80813'
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

    it('should respond with new photo', function() {
      newPhoto.filename.should.equal(newPhoto.md5 + '.jpg');
    });

  });

  describe('GET /api/photo', function() {

    before(function(done) {
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

    it('should respond array with length 2', function() {
      photos.should.be.instanceOf(Array);
      photos.should.have.length(2);
    });

  });

});
