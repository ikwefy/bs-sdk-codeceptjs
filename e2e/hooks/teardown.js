const allure = require('allure-commandline');

module.exports = async () => {
  const generation = allure(['generate', '../e2e/output', '--clean']);
  await generation.on('exit', code => {
    if (code === 0) {
      console.log(
        '\x1b[31m\x1b[43mReport generation complete! You can open the report by running "pnpm testReport" \x1b[0m',
      );
    } else {
      console.log('Report generation failed, see above.');
    }
  });
};
