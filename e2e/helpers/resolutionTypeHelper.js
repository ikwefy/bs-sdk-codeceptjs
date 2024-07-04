// eslint-disable-next-line camelcase
const Helper = codecept_helper;
const { getProfileDetails } = require('../config/getProfileDetails');

class ResolutionTypeHelper extends Helper {
  currentResolution = 'desktop';

  /**
   * resuolution type matrix object
   */
  resolutionMatrix = {
    mobile: { w: 320, h: 740 },
    desktop: { w: 1600, h: 1200 },
  };

  /**
   * set required viewport/window size
   * @param resolutionType - type of resolution (desktop/mobile)
   */
  async resizeWindow(resolutionType, newPage = undefined) {
    const { page } = this.helpers.Playwright;
    const setPage = newPage === undefined ? page : newPage;
    await setPage.setViewportSize({
      width: this.resolutionMatrix[resolutionType].w,
      height: this.resolutionMatrix[resolutionType].h,
    });
  }

  // need to rewrite to pass on browser configuration level
  /* eslint-disable-next-line no-underscore-dangle */
  async _before(test) {
    const { tags } = test;
    const cacheStorage = this.helpers.CacheStorageHelper;
    cacheStorage.addToStorage('tags', tags);
    if (tags && tags.includes('@mobile')) {
      if (this.currentResolution !== 'mobile') {
        this.currentResolution = 'mobile';
      }
    } else {
      this.currentResolution = 'desktop';
    }
    const profileDetails = getProfileDetails(process.env.profile);
    if (!profileDetails.emulate) {
      await this.resizeWindow(this.currentResolution);
      console.log(
        `[INFO] Test running in '${this.currentResolution}' resolution (${
          this.resolutionMatrix[this.currentResolution].w
        }x${this.resolutionMatrix[this.currentResolution].h})`,
      );
    } else {
      console.log(
        `[INFO] Test running in '${profileDetails.emulate.userAgent}' resolution (${profileDetails.emulate.viewport.width}x${profileDetails.emulate.viewport.height})`,
      );
    }
  }
}

module.exports = ResolutionTypeHelper;
