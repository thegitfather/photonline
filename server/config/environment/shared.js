'use strict';

exports = module.exports = {
  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // limits for angularFileUpload
  uploadLimits: {
    "minFileSize": 10240, // 10 KB
    "maxFileSize": 6291456, // 6 MB
    "queueLimit": 200
  }
};
