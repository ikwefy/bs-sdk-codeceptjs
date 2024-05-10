const { I, envUris } = inject();

module.exports = {
  async navigate() {
    await I.amOnPage(envUris.codeceptUrl);
  },
};
