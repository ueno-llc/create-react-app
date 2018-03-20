'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const BrowserRouter = require('react-router-dom/BrowserRouter').default;
const asyncBootstrapper = require('react-async-bootstrapper').default;
const { JobProvider } = require('react-jobs');
const { Provider } = require('mobx-react');
const { AsyncComponentProvider } = require('react-async-component');

const render = (App, store, container) => {
  // Does the user's browser support the HTML5 history API?
  // If the user's browser doesn't support the HTML5 history API then we
  // will force full page refreshes on each page change.
  const supportsHistory = 'pushState' in window.history;

  // Get any rehydrateState for the async components.
  // eslint-disable-next-line no-underscore-dangle
  const asyncComponentsRehydrateState = window.__asyncComponentsRehydrateState;

  // Get state for react jobs.
  // eslint-disable-next-line no-underscore-dangle
  const reactJobState = window.__reactJobState;

  // Get any storeState for the mobx store.
  // eslint-disable-next-line no-underscore-dangle
  store.rehydrate(window.__mobxStoreState);

  // Stream react to response
  const app = React.createElement(
    AsyncComponentProvider,
    { rehydrateState: asyncComponentsRehydrateState },
    React.createElement(
      JobProvider,
      { rehydrateState: reactJobState },
      React.createElement(
        Provider,
        Object.assign({}, store),
        React.createElement(
          BrowserRouter,
          { forceRefresh: !supportsHistory },
          React.createElement(App, null)
        )
      )
    )
  );

  asyncBootstrapper(app).then(() => {
    // Render the app to #root
    ReactDOM.hydrate(app, container);
  });
};

module.exports = {
  render,
};
