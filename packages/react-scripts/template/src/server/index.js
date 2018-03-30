/* eslint-disable no-console */
import app from './server';

// Get listening port
const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('[EXPRESS] Server started!');
});

// HMR Support
if (module.hot) {
  let newApp = app;
  // Accept ./server file
  module.hot.accept('./server', () => {
    // Stop listening to new connections
    server.removeListener('request', newApp);
    // Import changed server code
    import('./server')
      .then(module => {
        newApp = module.default;
        // Start listening to requests on the new server
        server.on('request', newApp);
        console.log('[EXPRESS] Restarted');
      })
      .catch(err => console.log('[EXPRESS] Failed to hot-reload server!', err));
  });
  // Accept this file
  module.hot.accept();
  // Close server connections when disposing for
  // incoming new hot reload change.
  module.hot.dispose(server.close);
}
