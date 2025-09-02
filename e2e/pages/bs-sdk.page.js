const { I, envUris } = inject();

module.exports = {
  async navigate() {
    await I.amOnPage(envUris.codeceptUrl);
    await I.amOnPage('//header');
  },
  async navigateWithWait() {
    await I.amOnPage(envUris.codeceptUrl);
    await I.wait(50);
    await I.amOnPage('//header');
  },
};
