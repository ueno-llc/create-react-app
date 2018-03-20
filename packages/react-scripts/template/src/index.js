import { render } from '@ueno/react-scripts/lib/client';
import Store from './store';
import App from './App';

// Store
const store = new Store();

// Container node
const container = document.getElementById('root');

// Render the app
render(App, store, container);

// HMR Support
if (module.hot) {
  module.hot.accept('./App', () => {
    render(require('./App').default, store, container);
  });
}
