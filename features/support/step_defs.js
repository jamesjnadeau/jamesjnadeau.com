module.exports = function() {

  this.Given(/^I have visited the site index$/, function () {
    browser.url('http://localhost:8080');
  });

  this.When(/^I click on `([^`]*)`$/, function (selector) {
    // Write the automation code here
    browser.click(selector);
  });

  this.Then(/^I see `([^`]*)` is visible$/, function (selector) {
    // Write the automation code here
    browser.waitForVisible(selector);
  });
}
