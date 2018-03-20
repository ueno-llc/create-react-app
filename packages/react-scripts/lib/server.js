/* global WEBPACK_MODE */
'use strict';

const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Helmet = require('react-helmet').default;
const { StaticRouter } = require('react-router-dom');
const { JobProvider, createJobContext } = require('react-jobs');
const { Provider } = require('mobx-react');
const { toJS } = require('mobx');
const asyncBootstrapper = require('react-async-bootstrapper').default;
const {
  AsyncComponentProvider,
  createAsyncContext,
} = require('react-async-component');

const appDirectory = fs.realpathSync(process.cwd());
const isDev =
  typeof WEBPACK_MODE !== 'undefined' && WEBPACK_MODE === 'development';
const { REMOTE_PORT: port, HOST: host = 'localhost' } = process.env;
const buildDir = path.join(
  appDirectory,
  isDev ? './node_modules/@ueno/react-scripts/config/build' : './build'
);

// Get server manifest
const getManifest = () => {
  try {
    return JSON.parse(
      fs.readFileSync(`${buildDir}/asset-manifest.json`, 'utf8')
    );
  } catch (err) {
    console.error('Failed reading asset-manifest.json');
  }
  return {};
};

let manifest = getManifest();

// Inject webpackDevServer hack
const writeWindow = items =>
  Object.entries(items).map(([key, value]) => `window.__${key} = ${value};`)
    .join`\n`;

const render = (App, store) => (req, res) => {
  // Create the job context for our provider, this grants
  // us the ability to track the resolved jobs to send back to the client.
  const jobContext = createJobContext();

  // Create the async components context for our provider.
  const asyncComponentsContext = createAsyncContext();

  // Get error
  const reactRouterContext = {
    status: 200,
  };

  const scripts = [];

  if (isDev) {
    // Inject scripts from client development server
    scripts.push(`http://${host}:${port}/static/js/bundle.js`);
    scripts.push(`http://${host}:${port}/static/js/vendors~main.chunk.js`);
    scripts.push(`http://${host}:${port}/static/js/main.chunk.js`);

    // Update manifest
    manifest = getManifest();
  } else {
    scripts.push(manifest['runtime~main.js']);
    scripts.push(manifest['vendors~main.js']);
    scripts.push(manifest['main.js']);
  }

  // Stream react to response
  const app = React.createElement(
    AsyncComponentProvider,
    { asyncContext: asyncComponentsContext },
    React.createElement(
      JobProvider,
      { jobContext: jobContext },
      React.createElement(
        Provider,
        Object.assign({}, store),
        React.createElement(
          StaticRouter,
          { location: req.url, context: reactRouterContext },
          React.createElement(App, null)
        )
      )
    )
  );

  asyncBootstrapper(app).then(() => {
    const globalVariables = writeWindow({
      devServerPort: port,
      mobxStoreState: JSON.stringify(toJS(store)),
      reactJobState: JSON.stringify(jobContext.getState()),
      asyncComponentsRehydrateState: JSON.stringify(
        asyncComponentsContext.getState()
      ),
    });

    // Add helmet stuff
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(Helmet, {}, [
        React.createElement(
          'script',
          { key: 'globalVariables' },
          globalVariables
        ),
      ])
    );
    const helmet = Helmet.renderStatic();

    // Check if the router context contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (reactRouterContext.url) {
      res.status(302).setHeader('Location', reactRouterContext.url);
      res.end();
      return;
    }

    const headScripts = React.Children.map(helmet.script.toComponent(), child =>
      React.cloneElement(
        child,
        Object.assign({ nonce: res.locals && res.locals.nonce }, child.props)
      )
    );

    res.writeHead(reactRouterContext.status, {
      'Content-Type': 'text/html; utf-8',
    });
    res.write('<!DOCTYPE>');
    res.write(`<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.style.toString()}
    ${ReactDOMServer.renderToStaticMarkup(headScripts)}
    <link href="${manifest['main.css']}" rel="stylesheet" />
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    ${helmet.noscript.toString()}
    <div id="root">`);

    const reactStream = ReactDOMServer.renderToNodeStream(app);
    // Pipe stream to response
    reactStream.pipe(res, { end: false });
    reactStream.on('end', () => {
      res.write(`</div>
      ${scripts.map(url => `<script src="${url}"></script>`).join`\n      `}
    </body>
  </html>`);
      res.end();
    });
  });
};

module.exports = {
  render,
  buildDir,
  staticDir: path.join(buildDir, 'static'),
};
