// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const spawn = require('react-dev-utils/crossSpawn');
const { defaultBrowsers } = require('react-dev-utils/browsersHelper');
const os = require('os');

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit(appPath) {
  let didInit = false;
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    didInit = true;

    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Init Create Ueno App with with CRA Ueno"', {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    if (didInit) {
      // If we successfully initialized but couldn't commit,
      // maybe the commit author config is not set.
      // In the future, we might supply our own committer
      // like Ember CLI does, but for now, let's just
      // remove the Git files to avoid a half-done state.
      try {
        // unlinkSync() doesn't work on directories.
        fs.removeSync(path.join(appPath, '.git'));
      } catch (removeErr) {
        // Ignore.
      }
    }
    return false;
  }
}

module.exports = function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  templateName
) {
  const appPackage = require(path.join(appPath, 'package.json'));
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

  if (!templateName) {
    console.log('');
    console.error(
      `A template was not provided. This is likely because you're using an outdated version of ${chalk.cyan(
        'create-react-app'
      )}.`
    );
    console.error(
      `Please note that global installs of ${chalk.cyan(
        'create-react-app'
      )} are no longer supported.`
    );
    return;
  }

  const templatePath = path.join(
    require.resolve(templateName, { paths: [appPath] }),
    '..'
  );

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};
  appPackage.dependencies['react'] = '16.13.1';
  appPackage.dependencies['react-dom'] = '16.13.1';
  appPackage.dependencies['react-helmet'] = '5.2.1';
  appPackage.dependencies['react-router-dom'] = '5.1.2';
  appPackage.dependencies['gsap'] = '3.2.6';
  appPackage.dependencies['gsap-tools'] = '1.0.12';
  appPackage.dependencies['lodash'] = '4.17.15';
  appPackage.dependencies['node-sass'] = '4.13.1';

  appPackage.devDependencies = appPackage.devDependencies || {};
  appPackage.devDependencies['@types/node'] = '13.9.8';
  appPackage.devDependencies['@types/react'] = '16.9.31';
  appPackage.devDependencies['@types/react-dom'] = '16.9.6';
  appPackage.devDependencies['@types/react-helmet'] = '5.0.15';
  appPackage.devDependencies['@types/react-router-dom'] = '5.1.3';
  appPackage.devDependencies['@ueno/stylelint-config'] = '1.1.2';
  appPackage.devDependencies['@ueno/tslint-config'] = '1.0.8';
  appPackage.devDependencies['stylelint'] = '13.2.1';
  appPackage.devDependencies['tslint'] = '6.1.0';
  appPackage.devDependencies['tslint-react'] = '4.2.0';
  appPackage.devDependencies['typescript'] = '3.8.3';

  // Setup the script rules
  appPackage.scripts = {
    dev: 'react-scripts start',
    start: 'react-scripts start',
    build: 'react-scripts build',
    lint: 'npm run tslint && npm run stylelint',
    tslint: "tslint --fix 'src/**/*.{ts,tsx}' -p .",
    stylelint: "stylelint 'src/**/*.scss' --syntax scss",
  };

  // Setup the browsers list
  appPackage.browserslist = defaultBrowsers;

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    );
  }

  // Copy the files for the user
  const templateDir = path.join(templatePath, 'template');
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templateDir)}`
    );
    return;
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    );
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'));
      fs.appendFileSync(path.join(appPath, '.gitignore'), data);
      fs.unlinkSync(path.join(appPath, 'gitignore'));
    } else {
      throw err;
    }
  }

  const dotFiles = ['editorconfig', 'stylelintrc'];
  dotFiles.forEach(dotFile => {
    try {
      fs.moveSync(
        path.join(appPath, dotFile),
        path.join(appPath, '.' + dotFile),
        []
      );
    } catch (err) {
      if (err.code === 'EEXIST') {
        const data = fs.readFileSync(path.join(appPath, dotFile));
        fs.appendFileSync(path.join(appPath, '.' + dotFile), data);
        fs.unlinkSync(path.join(appPath, dotFile));
      }
    }
  });

  let command;
  let args;

  if (useYarn) {
    command = 'yarnpkg';
    args = ['add', '-E'];
  } else {
    command = 'npm';
    args = ['install', '--save', '-E', verbose && '--verbose'].filter(e => e);
  }
  args.push(
    'react@' + appPackage.dependencies['react'],
    'react-dom@' + appPackage.dependencies['react-dom']
  );

  // Install additional template dependencies, if present
  const templateDependenciesPath = path.join(
    appPath,
    '.template.dependencies.json'
  );
  if (fs.existsSync(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies;
    args = args.concat(
      Object.keys(templateDependencies).map(key => {
        return `${key}@${templateDependencies[key]}`;
      })
    );
    fs.unlinkSync(templateDependenciesPath);
  }

  // Copy ovewrites files
  try {
    fs.copyFileSync(
      path.join(__dirname, './overwrites/Link.tsx'),
      path.join(appPath, 'src/components/link/Link.tsx')
    );
  } catch (e) {
    console.log("-Can't copy Link.tsx to src/components/link/Link.tsx", e);
  }

  try {
    fs.copyFileSync(
      path.join(__dirname, './overwrites/index.tsx'),
      path.join(appPath, 'src/index.tsx')
    );
  } catch (e) {
    console.log("-Can't copy index.tsx to src/index.tsx", e);
  }

  try {
    fs.copyFileSync(
      path.join(__dirname, './overwrites/serviceWorker.ts'),
      path.join(appPath, 'src/serviceWorker.ts')
    );
  } catch (e) {
    console.log("-Can't copy serviceWorker.ts to src/serviceWorker.ts", e);
  }

  // Remove readme.md file from src submodule
  try {
    fs.unlinkSync(path.join(appPath, 'README.md'));
  } catch (e) {
    console.log("-Can't remove README.md from src/", e);
  }

  // Install react and react-dom for backward compatibility with old CRA cli
  // which doesn't install react and react-dom along with react-scripts
  // or template is presetend (via --internal-testing-template)
  if (!isReactInstalled(appPackage) || templateName) {
    console.log(`Installing react and react-dom using ${command}...`);
    console.log();

    const proc = spawn.sync(command, args, { stdio: 'inherit' });
    if (proc.status !== 0) {
      console.error(`\`${command} ${args.join(' ')}\` failed`);
      return;
    }
  }

  // Install dependencies
  console.log();
  console.log('Installing @ueno packages...');
  console.log();
  const proc = spawn.sync(command, ['install'], { stdio: 'inherit' });
  if (proc.status !== 0) {
    console.error(`\`${command} install\` failed`);
    return;
  } else {
    console.log(' done!');
  }

  if (tryGitInit(appPath)) {
    console.log();
    console.log('Initialized a git repository.');
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}eject`)
  );
  console.log(
    '    Removes this tool and copies build dependencies, configuration files'
  );
  console.log(
    '    and scripts into the app directory. If you do this, you can’t go back!'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    );
  }
  console.log();
  console.log('Happy hacking!');
};

function isReactInstalled(appPackage) {
  const dependencies = appPackage.dependencies || {};

  return (
    typeof dependencies.react !== 'undefined' &&
    typeof dependencies['react-dom'] !== 'undefined'
  );
}
