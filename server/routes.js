/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  var env = app.get('env');
  // Insert routes below
  app.use('/api/admin', require('./api/admin').default);
  app.use('/api/users', require('./api/user').default);
  app.use('/api/gallery', require('./api/gallery').default);
  app.use('/api/photo', require('./api/photo').default);

  app.use('/auth', require('./auth').default);

  // allow GET environment var
  app.get("/server/env", function(req, res) {
    res.status(200).json({env: env});
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
  // app.route('/:url(api|auth|components|app|assets)/*').get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*').get((req, res) => {
    res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
  });
}
