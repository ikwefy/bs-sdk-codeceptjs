const playwrightProfileMatrix = require('./playwrightBrowserProfiles');

const browserstackCreds = {
  user: 'YUOR_USERNAME',
  key: 'YUOR_PASSWORD',
};

function setBrowserstackConfig(browserConfig, args) {
  const bsConfig = browserConfig;
  const additionalCaps = {
    projectName: args.env.toUpperCase(),
    buildName: args.suite,
    resolution: '1600x1200',
    'browserstack.local': 'false',
    'browserstack.networkLogs': 'true',
    'browserstack.console': 'info',
    'browserstack.username': browserstackCreds.user,
    'browserstack.accessKey': browserstackCreds.key,
  };
  Object.assign(bsConfig.extra.capabilities, additionalCaps);
  if (args.env === 'dev') {
    bsConfig.extra.capabilities['browserstack.local'] = 'true';
  }
  return bsConfig;
}

function getBrowserConfig(args) {
  const available = Object.keys(playwrightProfileMatrix).map(key => {
    return key;
  });

  if (available.indexOf(args.browser) === -1) {
    throw new Error(
      `${args.browser} is not supported, available profiles are ${available}, you can add new browser profiles by editing browserProfiles.js`,
    );
  }
  let browserConfig = playwrightProfileMatrix[args.browser];

  if (browserConfig.extra.isBrowserstackProfile) {
    browserConfig = setBrowserstackConfig(browserConfig, args);
  }

  return browserConfig;
}

module.exports = {
  browserstackCreds,
  getBrowserConfig,
};
