// eslint-disable-next-line no-unused-vars
const { devices } = require('playwright');
const cp = require('child_process');

const clientPlaywrightVersion = cp
  .execSync(`pnpm playwright --version`)
  .toString()
  .trim()
  .split(' ')[1]; // example '1.11.1'

const playwrightVersion = {
  'client.playwrightVersion': clientPlaywrightVersion,
};
const timeoutMs = 10000;

const playwrightConfig = {
  url: 'http://',
  browser: 'chromium',
  waitForTimeout: timeoutMs,
  timeout: timeoutMs,
  restart: 'session',
  keepBrowserState: true,
  keepCookies: true,
  trace: true,
  keepTraceForPassedTests: true,
  chromium: {
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--ignore-certificate-errors',
      '--enable-automation',
    ],
    // devtools: true, // for local debug needs
  },
  // emulate: devices['iPad Pro 11'], // for local mobile testing needs
  // locale: 'en-GB', // for local debug needs in headless
};

const profileMatrix = {
  chrome: {
    extra: {
      browserName: 'Chrome',
      isBrowserstackProfile: false,
    },
    main: {
      show: true,
      ...playwrightConfig,
    },
  },
  chromeHeadless: {
    extra: {
      browserName: 'ChromeHeadless',
      isBrowserstackProfile: false,
    },
    main: {
      show: false,
      ...playwrightConfig,
    },
  },
  safariBrowserstack: {
    extra: {
      browserName: 'Safari',
      isBrowserstackProfile: true,
      capabilities: {
        browser: 'playwright-webkit',
        os: 'osx',
        os_version: 'Ventura',
        browser_version: 'latest',
        'browserstack.safari.enablePopups': 'true',
        'browserstack.safari.allowAllCookies': 'true',
        ...playwrightVersion,
      },
    },
    main: {
      show: true,
      ...playwrightConfig,
    },
  },
  firefoxBrowserstack: {
    extra: {
      browserName: 'Firefox',
      isBrowserstackProfile: true,
      capabilities: {
        browser: 'playwright-firefox',
        os: 'windows',
        os_version: '10',
        browser_version: 'latest',
        ...playwrightVersion,
      },
    },
    main: {
      show: true,
      ...playwrightConfig,
    },
  },
  edgeBrowserstack: {
    extra: {
      browserName: 'Edge',
      isBrowserstackProfile: true,
      capabilities: {
        browser: 'edge',
        os: 'windows',
        os_version: '10',
        browser_version: 'latest',
        ...playwrightVersion,
      },
    },
    main: {
      show: true,
      ...playwrightConfig,
    },
  },
  chromeBrowserstack: {
    extra: {
      browserName: 'Chrome',
      isBrowserstackProfile: true,
      capabilities: {
        browser: 'chrome',
        os: 'osx',
        os_version: 'Monterey',
        browser_version: 'latest',
        ...playwrightVersion,
      },
    },
    main: {
      show: true,
      ...playwrightConfig,
    },
  },
};

module.exports = profileMatrix;
