const { event, recorder, container } = require('codeceptjs');
const process = require('process');

const { envUrisEd } = inject();
const BrowserStackLocal = require('browserstack-local');
const { browserstackCreds } = require('../config/getBrowserProfiles');
const { getProfileDetails } = require('../config/getProfileDetails');

const profileDetails = getProfileDetails(process.profile);
const helper = container.helpers().PlaywrightHelper;
const playwright = container.helpers().Playwright;
const uniqueIdent = `browserStack_${Date.now()}`;
const bsLocal = new BrowserStackLocal.Local();

function shouldStartBsLocal() {
  return (
    profileDetails.profile.env === 'dev' && profileDetails.isBrowserstackProfile
  );
}

async function shouldCloseFailedTab() {
  const numOfTabs = await playwright.grabNumberOfOpenTabs();
  return numOfTabs > 1;
}

async function checkBsLocalIsRunning(state) {
  await helper.waitUntil(
    async () => {
      console.log(`BrowserStackLocal running state = ${bsLocal.isRunning()}`);
      return bsLocal.isRunning() === state;
    },
    20000,
    `BrowserStackLocal running state is wrong, expected ${state}`,
    3000,
  );
}

module.exports = () => {
  event.dispatcher.on(event.suite.before, () => {
    if (shouldStartBsLocal()) {
      recorder.add('Starting browserstack local', async () => {
        bsLocal.start({ uniqueIdent, key: browserstackCreds.key }, () =>
          console.log('Starting BrowserStackLocal ...'),
        );
        await checkBsLocalIsRunning(true);
      });
    }
  });
  event.dispatcher.on(event.all.after, () => {
    if (shouldStartBsLocal()) {
      recorder.add('Stopping browserstack local', async () => {
        bsLocal.killAllProcesses(() =>
          console.log('Killing all BrowserStackLocal processes ...'),
        );
        bsLocal.stop(() => console.log('Stopping BrowserStackLocal ...'));
        await checkBsLocalIsRunning(false);
      });
    }
  });
  event.dispatcher.on(event.test.before, currentConfig => {
    const environment =
      envUrisEd.name[0].toUpperCase() + envUrisEd.name.slice(1);
    if (
      currentConfig.tags.includes(`@skip${environment}`) ||
      currentConfig.tags.includes('@requireStabilisation')
    ) {
      // eslint-disable-next-line no-param-reassign
      currentConfig.run = function skip() {
        this.skip();
      };
    }
  });
  event.dispatcher.on(event.test.passed, async test => {
    recorder.add('Mark test passed on browerstack', async () => {
      if (profileDetails.isBrowserstackProfile) {
        await helper.markTest('passed', `${test.title}`);
      }
    });
  });
  event.dispatcher.on(event.test.failed, async test => {
    recorder.add('Mark test failed on browerstack', async () => {
      if (profileDetails.isBrowserstackProfile) {
        await helper.markTest('failed', `${test.title}`);
      }
    });
    recorder.add('Close failed tabs', async () => {
      if (await shouldCloseFailedTab()) {
        await playwright.closeCurrentTab();
      }
    });
  });
};
