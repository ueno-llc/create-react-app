# [@ueno/create-react-app](/ueno-llc/create-react-app)

Hello and welcome to a server-side rendered create-react-app.

Below are the available yarn commands:

### `yarn dev`

Start the app in development mode.
The server will restart in background without closing HTTP connections.

### `yarn build`

Build the application

### `yarn build:static`

Build a static version of the application.

Note: Script relies on wget.

### `yarn start`

Starts the application (you must build first with `yarn build`).


## PostCSS

We included no postcss.config.js file, you can add your own in the project root.

If none is provided, default config includes `autoprefixer` and `flexbugs-fixes`.

## Profile hot-reloads

You can paste into your chrome devtools console and have the time each hot-reload build takes reported in the console.

```js
webpackProfiler = true;
```
