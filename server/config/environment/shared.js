'use strict';

exports = module.exports = {
  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // limits for angularFileUpload
  uploadLimits: {
    "minFileSize": 10240, // 10 KB
    "maxFileSize": 8388608, // 8 MB
    "queueLimit": 100
  },

  poolPath: './uploads/pool/'
};
