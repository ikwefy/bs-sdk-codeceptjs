const { event, recorder, container } = require('codeceptjs');
const process = require('process');

const { getProfileDetails } = require('../config/getProfileDetails');

const profileDetails = getProfileDetails(process.profile);
const playwright = container.helpers().Playwright;

module.exports = () => {
  event.dispatcher.on(event.test.finished, () => {
    console.info(`=================After test report`);
    if (profileDetails.isAccessibilityRun) {
      recorder.add('Work with accessibility report assertions', async () => {
        try {
          console.info(`=================Srart Accessibility report`);
          const { page } = playwright;
          const accessibilityReport = await page.getAccessibilityResults();
          const jsonResults = JSON.stringify(accessibilityReport);
          console.info(`=================Accessibility report: ${jsonResults}`);
        } catch (e) {
          console.error(e.message);
        }
      });
    }
  });
};
