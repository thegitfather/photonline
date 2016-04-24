/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import mkdirp from 'mkdirp';
import path from 'path';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express').default(app);
require('./routes').default(app);

console.log("config.publicPath:", config.publicPath);
console.log("config.ip:", config.ip);
console.log("config.port:", config.port);
console.log("config.mongo.uri:", config.mongo.uri);

// Create upload directories
mkdirp.sync( config.publicPath + '/photo_pool' );
mkdirp.sync( config.publicPath + '/photo_thumbs' );
mkdirp.sync( config.publicPath + '/gallery_thumbs' );

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
