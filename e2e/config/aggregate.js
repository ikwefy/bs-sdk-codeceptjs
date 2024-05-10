const fs = require('fs');
const { parseProfile } = require('./getProfileDetails');
const baseIncludes = require('./pageIncludes');
const getPlugins = require('./getPlugins');
const getHelpers = require('./getHelpers');

const testsPath = './tests';
const configsPath = '../config';

const configMatch = /^config.(.*).js$/;
const stepFileMatch = /(.*)\.e2e.steps\.js/;

function log(message) {
  console.log(`[INFO] ${message}`);
}

const scanStepFiles = (dir, matcher) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const currentFile = `${dir}/${file}`;
    const stat = fs.statSync(currentFile);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanStepFiles(currentFile, matcher));
    } else {
      const match = matcher.test(currentFile);
      if (match) {
        results.push(currentFile);
      }
    }
  });
  return results;
};

function makeDataConfigObj(fileList, uriMatch) {
  const configFiles = { uri: [], testData: [] };

  fileList.forEach(file => {
    const isUriConfig = file.match(uriMatch);

    if (isUriConfig) {
      configFiles.uri.push({
        fileName: isUriConfig[0],
        match: isUriConfig[1],
      });
    }
  });

  return configFiles;
}

function selectDesired(list, desired, path) {
  const available = list.map(item => {
    return item.match;
  });

  const selected = list.find(item => {
    return item.match === desired;
  });

  if (!selected) {
    throw new Error(`${desired} was not found, options are ${available}`);
  }

  return `${path}/${selected.fileName}`;
}

function aggregate(testString) {
  /*
  because we're depending on the test string to learn what files to load,
  we need a default for when a --profile arg is not received
  such as when launching 'pnpm capabilities'
  */
  const defaultTestString = 'dev::chrome';

  // parse the string passed in the --profile arg
  const argsObject = parseProfile(testString || defaultTestString);

  // read the test folder for steps and the config folder for configs
  const stepsFiles = scanStepFiles(testsPath, stepFileMatch);
  log(`Read tests folder: ${stepsFiles.length} step files found`);
  const allConfigFiles = fs.readdirSync(configsPath, 'utf-8');
  log(`Read config folder: ${allConfigFiles.length} config files found`);

  // filter out the required config files and store them in a neat lil' object
  const parsedConfigFilesEd = makeDataConfigObj(allConfigFiles, configMatch);

  // select what files contain the data the environment requires
  const selectedEnv = selectDesired(
    parsedConfigFilesEd.uri,
    argsObject.env,
    configsPath,
  );

  const helpersConfig = getHelpers(argsObject);
  log(`Loading helpers config for '${argsObject.browser}'`);

  const pluginsConfig = getPlugins(argsObject.helper);
  log(`Loading plugins config for '${argsObject.helper}'`);

  baseIncludes.include.envUris = selectedEnv;
  log(
    `Loading env config ${selectedEnv}, accessible in the tests as 'envUris'`,
  );

  log(`Included ${stepsFiles.length} steps files in the config`);

  let testsRunning = 'ALL';
  if (!testString) {
    testsRunning = 'NO';
  } else if (argsObject.suite) {
    testsRunning = argsObject.suite;
  }

  log(
    `Running "${testsRunning}" tests on the "${argsObject.env}" environment on the "${argsObject.browser}" browser...`,
  );

  return {
    include: baseIncludes.include,
    grep: argsObject.suite,
    steps: stepsFiles,
    helpers: helpersConfig,
    plugins: pluginsConfig,
  };
}

module.exports = aggregate;
