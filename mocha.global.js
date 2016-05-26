import app from './';
import mongoose from 'mongoose';
import {cleanDB} from './server/api/admin/admin.controller.js';

before(function() {
  cleanDB();
});

after(function(done) {
  app.angularFullstack.on('close', () => done());
  mongoose.connection.close();
  app.angularFullstack.close();
});
