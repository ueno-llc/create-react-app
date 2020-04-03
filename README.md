[![logo](https://user-images.githubusercontent.com/937328/53345335-9133e980-390c-11e9-9e81-d7c000195415.png)](https://ueno.co/?utm_source=github&utm_campaign=ueno-cra-starter)
<br /><br />
![banner](https://user-images.githubusercontent.com/937328/53875765-3762ac00-3ffd-11e9-8ca3-03db4337a1f0.png)
<br /><br />
[![about](https://user-images.githubusercontent.com/937328/51540139-999c8e80-1e4d-11e9-866d-284657a34744.png)](https://ueno.co/contact/?utm_source=github&utm_campaign=ueno-cra-starter)
<br /><br />

## CRA Ueno

[![npm version](https://badge.fury.io/js/%40ueno%2Freact-scripts.svg)](https://badge.fury.io/js/%40ueno%2Freact-scripts)

This package is a fork of the original [Create React App](https://github.com/facebook/create-react-app), modified with a custom script version (`packages/react-scripts`). We changed the configuration to fit our needs. It contains the following features that aren't in the original one:

- Server side rendering
- Code splitting
- CSS modules
- SASS support
- Typescript
- Prettier, lint-staged, husky, stylelint

### Usage with [create-ueno-app](https://github.com/ueno-llc/create-ueno-app):

```bash
npx create-ueno-app cra my-app
```

or

```bash
yarn create ueno-app cra my-app
```

<details>
  <summary>Alternative setup</summary>
  <p>
  If you already have `create-react-app` installed, you won't have to install anything, you'll just have to supply the script version.

```bash
create-react-app --scripts-version @ueno/react-scripts my-app
```

  </p>
</details>

### Publishing

To push a new update of `@ueno/react-scripts` to npm use:

```bash
yarn lerna publish --scope="@ueno/react-scripts"
```

To push a new update of `@ueno/cra-template` to npm use:

```bash
yarn lerna publish --scope="@ueno/cra-template"
```
