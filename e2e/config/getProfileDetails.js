const { getBrowserConfig } = require('./getBrowserProfiles');
const defaultProfile = 'int::chromeHeadless:playwright:false';

function parseProfile(profile = defaultProfile) {
  const splitArgs = profile.split(':');
  return {
    env: splitArgs[0] || 'int',
    suite: splitArgs[1],
    browser: splitArgs[2] || 'chromeHeadless',
    helper: splitArgs?.[3] || 'playwright',
  };
}
function getProfileDetails(profile) {
  const argsObject = parseProfile(profile);
  const browserConfig = getBrowserConfig(argsObject);

  return {
    profile: argsObject,
    browserName: browserConfig.extra.browserName,
    isBrowserstackProfile: browserConfig.extra.isBrowserstackProfile,
    isHeadless: !browserConfig.show,
    emulate: browserConfig.emulate,
    isAccessibilityRun: true,
  };
}

module.exports = {
  parseProfile,
  getProfileDetails,
};
