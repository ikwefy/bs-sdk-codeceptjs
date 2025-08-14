function getPlugins() {
  return {
    screenshotOnFail: {
      enabled: true,
    },
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
    },
    retryFailedStep: {
      enabled: true,
      retries: 5,
    },
    allureAttachment: {
      enabled: true,
      require: './plugins/allureAttachment',
    },
    hooksPlugin: {
      enabled: true,
      require: './plugins/beforeAfter.js',
    },
  };
}

module.exports = getPlugins;
