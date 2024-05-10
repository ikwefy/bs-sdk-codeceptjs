function getHelpers() {
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
    Playwright: {
      url: 'http://',
      browser: 'chromium',
      waitForTimeout: 1000,
      timeout: 1000,
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
    },
  };

  return baseHelpers;
}

module.exports = getHelpers;
