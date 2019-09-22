"use strict";

const { BrowserWindow } = require("electron");
const { GOOGLE_TRANSLATE_URL } = require("./config");

function createGoogleTranslateWindow() {
  const window = new BrowserWindow({
    width: 450,
    height: 500,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    "node-integration": false
  });
  window.setVisibleOnAllWorkspaces(true);
  window.loadURL(GOOGLE_TRANSLATE_URL.replace(":text", ""));

  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  return window;
}

module.exports = {
  createGoogleTranslateWindow
};
