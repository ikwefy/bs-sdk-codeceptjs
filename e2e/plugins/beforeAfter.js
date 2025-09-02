const { event, recorder } = require('codeceptjs');
const process = require('process');
const { logToFile } = require('../utils/logger');
const { I } = inject();

const { getProfileDetails } = require('../config/getProfileDetails');

const profileDetails = getProfileDetails(process.env.profile);

module.exports = () => {
  event.dispatcher.on(event.test.finished, async () => {
    console.info(`=================After test report`);
    if (profileDetails.isAccessibilityRun) {
        try {
          const accessibilityResults = await I.getAccessibilityResults();
          logToFile(`hi`);
          logToFile(`Report is ${accessibilityResults === undefined}`);
          logToFile(`Full Accessibility Report: ${JSON.stringify(accessibilityResults, null, 2)}`);
        } catch (e) {
          console.error(`Accessibility check failed: ${e.message}`);
        }
    }
  });
};
