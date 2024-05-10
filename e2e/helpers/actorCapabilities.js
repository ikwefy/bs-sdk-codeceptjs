/* eslint-disable func-names */
/* eslint-disable object-shorthand */
/* looks like codeceptjs has a problem with JS arrow funcs */

module.exports = () => {
  return actor({
    clickWhenClickable: function(elementLocator, waitTime) {
      this.waitForVisible(elementLocator, waitTime);
      this.click(elementLocator);
    },
  });
};
