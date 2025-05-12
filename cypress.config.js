const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: "https://www.bigbasket.com",
    setupNodeEvents(on, config) {
      on("task", {
        doesFileExist(filePath) {
          return fs.existsSync(filePath);
        },
      });
    }
  },
});
