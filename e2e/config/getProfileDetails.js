function parseProfile(profile) {
  const splitArgs = profile.split(':');
  return {
    env: splitArgs[0],
    suite: splitArgs[1],
    browser: splitArgs[2],
    helper: splitArgs?.[3] || 'playwright',
  };
}
function getProfileDetails(profile) {
  const argsObject = parseProfile(profile);
  const browserConfig = getBrowserConfig(argsObject);

  return {
    profile: argsObject,
    isHeadless: !browserConfig.show,
    isPlaywright: profile.helper === 'playwright',
    emulate: browserConfig.emulate,
  };
}

module.exports = {
  parseProfile,
  getProfileDetails,
};
