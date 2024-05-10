/* eslint-disable no-param-reassign */

module.exports = async () => {
  codeceptjs.locator.addFilter((providedLocator, locatorObj) => {
    if (providedLocator.test) {
      locatorObj.type = 'css';
      locatorObj.value = `[data-test-id=${providedLocator.test}]`;
    }
    if (providedLocator.dataTestId) {
      locatorObj.type = 'css';
      locatorObj.value = `[data-testid=${providedLocator.dataTestId}]`;
    }
  });
};
