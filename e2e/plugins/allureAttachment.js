const { event, recorder, output, container } = require('codeceptjs');
const fs = require('fs');
const { parseProfile } = require('../config/getProfileDetails');

const profileDetails = parseProfile(process.env.profile);

const defaultConfig = {
  disableLogs: false,
};

function checkRequiredHelper() {
  const helpers = container.helpers();
  const supportedHelpers = ['PlaywrightListenerHelper'];
  let helper;
  /* The following code is to insure the codeceptJS instance has the helpers
  this plugin cannot work without.
  As a bonus, it makes the helper functions accessible in this scope, via the
  `helper` variable
  */
  supportedHelpers.forEach(helperName => {
    if (Object.keys(helpers).indexOf(helperName) > -1) {
      helper = helpers[helperName];
    }
  });

  return helper;
}

async function startConsoleListener(helper) {
  event.dispatcher.on(event.test.started, async () => {
    await helper.invokeConsoleListenerByMessageType();
  });
}

async function attachToAllure(message, item, type = 'application/json') {
  const allureReporter = container.plugins('allure');
  if (allureReporter) {
    allureReporter.addAttachment(message, item, type);
  } else {
    throw Error('[Allure] Plugin has not been found');
  }
}

async function invokeOnAfterTestEvent(helper) {
  event.dispatcher.on(event.test.after, test => {
    recorder.add(
      `Attaching browser logs after test: "${test.title}"`,
      async () => {
        if (profileDetails.browser !== 'chrome') {
          output.plugin(
            'allureBrowserLog',
            'Browser log extraction only available for CHROME',
          );
          return;
        }
        output.plugin(
          'allureBrowserLog',
          `Test done, saving browser log for test: "${test.title}"`,
        );
        try {
          const logs = await helper.getCollectedLogs();
          if (logs.length > 0) {
            /* 
            The following code attaches logs to allure report
            */
            await attachToAllure('Browser logs', JSON.stringify(logs));
            /* 
            The following code is to clear browser log array
            */
            await helper.cleanCollectedLogs();
          }
        } catch (err) {
          console.log(`[Allure] Error in try catch ${err}`);
          console.log('[Allure] Attaching browser logs failed silently');
        }
      },
      true,
    );
  });
}

async function invokeOnFinishedTestEvent() {
  event.dispatcher.on(event.test.finished, test => {
    recorder.add(
      `Attaching playwright traces after test finish: "${test.title}"`,
      async () => {
        output.plugin(
          'allurePlaywrightTrace',
          `Test done, saving playwright trace for test: "${test.title}"`,
        );
        try {
          if (test.artifacts.trace !== undefined) {
            const traces = fs.readFileSync(test.artifacts.trace);
            /* 
            The following code attaches traces to allure report
            */
            await attachToAllure(
              'Playwright traces',
              traces,
              'application/zip',
            );
          }
        } catch (err) {
          console.log(`[Allure] Error in try catch ${err}`);
          console.log('[Allure] Attaching playwright traces failed silently');
        }
      },
      true,
    );
  });
}

module.exports = async config => {
  const helper = checkRequiredHelper();
  if (!helper) {
    console.log('[Allure] No helpers found to get browser logs');
    return;
  }
  const options = Object.assign(defaultConfig, config);
  if (options.disableLogs) {
    return;
  }

  /* 
  The following code is to invoke browser log listener on test start and collect them into array
  */
  await startConsoleListener(helper);
  await invokeOnAfterTestEvent(helper);
  await invokeOnFinishedTestEvent();
};
