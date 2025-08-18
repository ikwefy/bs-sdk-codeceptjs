const { event, recorder } = require('codeceptjs');
const process = require('process');

const { getProfileDetails } = require('../config/getProfileDetails');

const profileDetails = getProfileDetails(process.env.profile);

module.exports = () => {
  event.dispatcher.on(event.all.after, () => {
    console.info(`=================After test report`);
    if (profileDetails.isAccessibilityRun) {
      recorder.add('Work with accessibility report assertions', async ({ I }) => {
        try {
          console.info(`================= Start Accessibility report`);

          // Fetch accessibility results
          const accessibilityResults = await I.getAccessibilityResults();

          // Log full results for reference
          console.info(`Full Accessibility Report: ${JSON.stringify(accessibilityResults, null, 2)}`);

          // Filter for color-contrast issues
          const colorContrastIssues = accessibilityResults.violations.filter(
            v => v.id === 'color-contrast'
          );
          const colorContrastIssueCount = colorContrastIssues.length;
          console.log(`Color Contrast Issue Count: ${colorContrastIssueCount}`);

          if (colorContrastIssueCount >= 100) {
            throw new Error("Color contrast issue count breached the threshold!");
          }

          // Filter for critical severity issues
          const criticalIssues = accessibilityResults.violations.filter(
            v => v.impact === 'critical'
          );
          console.log(`Critical Issue Count: ${criticalIssues.length}`);

        } catch (e) {
          console.error(`Accessibility check failed: ${e.message}`);
        }
      });
    }
  });
};
