/* eslint-disable global-require */
const aggregatedData = require('./config/aggregate')(process.profile);

exports.config = {
  tests: './*_test.js',
  grep: aggregatedData.grep,
  output: './output',
  timeout: 600,
  helpers: aggregatedData.helpers,
  name: 'e2e',
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          verbose: true,
          steps: true,
        },
      },
      'mocha-junit-reporter': {
        stdout: './junitReport/console.log',
        options: {
          mochaFile: './junitReport/result.xml',
          // attachments: true, // add screenshot for a failed test
        },
      },
    },
  },
  bootstrap: require('./hooks/bootstrap'),
  teardown: require('./hooks/teardown'),
  include: aggregatedData.include,
  gherkin: {
    features: '../**/*.feature',
    steps: aggregatedData.steps,
  },
  plugins: aggregatedData.plugins,
};
