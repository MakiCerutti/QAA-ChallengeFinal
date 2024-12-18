const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
  chromeWebSecurity: false,
  video:true,
  screenshotOnRunFailure: true,
  videosFolder: "cypress/videos",
  screenshotsFolder: "cypress/screenshots"
});
