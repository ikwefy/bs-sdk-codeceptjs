function getPlugins() {
  return {
    tryTo: {
      enabled: true,
    },
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
  };
}

module.exports = getPlugins;
