const { getBrowserConfig } = require('./getBrowserProfiles.js');

function getHelpers(argsObject) {
  let codeceptHelpers;
  const baseHelpers = {
    GraphQL: {
      defaultHeaders: {
        'content-type': 'application/json',
      },
    },
    REST: {
      defaultHeaders: {
        'content-type': 'application/json',
      },
    },
    AssertWrapper: {
      require: 'codeceptjs-assert',
    },
  };

  const playwrightConfig = getBrowserConfig(argsObject);
  if (playwrightConfig.extra.isBrowserstackProfile) {
    const bsEndpoint = {
      browserWSEndpoint: {
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
          JSON.stringify(playwrightConfig.extra.capabilities),
        )}`,
      },
    };
    Object.assign(playwrightConfig.main.chromium, bsEndpoint);
  }
  const playwrightHelper = {
    Playwright: {
      ...playwrightConfig.main,
    },
  };
  codeceptHelpers = {
    ...baseHelpers,
    ...playwrightHelper,
  };

  return codeceptHelpers;
}

module.exports = getHelpers;
