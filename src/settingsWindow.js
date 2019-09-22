"use strict";

const storage = require("electron-json-storage");

function createSettingsWindow() {
  const userConfig = { shortcutKeys: "CommandOrControl+Shift+0" };
  storage.set("userConfig", userConfig, function(error) {
    if (error) {
      throw error;
    }
  });
}

module.exports = {
  createSettingsWindow
};
