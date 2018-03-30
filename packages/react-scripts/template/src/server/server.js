import express from 'express';
import { render, staticDir, buildDir } from '@ueno/react-scripts/lib/server';
import compression from 'compression';
import security from './security';
import Store from '../store';
import App from '../App';

// Create express app
const app = express();

// Don't expose any software information to potential hackers.
app.disable('x-powered-by');

// Security middlewares.
app.use(...security);

// Gzip compress the responses.
app.use(compression());

// Serve static assets
app.use('/static', express.static(staticDir));

// Serve public files
app.use(express.static('public'));

// ServiceWorker support
app.get(
  /(sw.js|asset-manifest.json|\/precache-manifest*)/,
  (req, res, next) => {
    res.sendFile(req.originalUrl, { root: buildDir }, err => err && next());
  }
);

// Serve react app
app.get('*', (req, res) => {
  const store = new Store();
  render(App, store)(req, res);
});

export default app;
