"use strict";

const { app, ipcMain, globalShortcut, clipboard } = require("electron");
const storage = require("electron-json-storage");
const { autoUpdater } = require("electron-updater");

const { createGoogleTranslateWindow } = require("./googleTranslateWindow");
const { createTray } = require("./tray");
const { GOOGLE_TRANSLATE_URL } = require("./config");
const { createSettingsWindow } = require("./settingsWindow");

function showWindow(window, { position }) {
  if(process.platform === "win32" ) {
      let screenInfo = require("electron").screen.getPrimaryDisplay().size;
      let windowWidth =  450;  // get this dynamically
      let windowHeight = 500;  // get this dynamically

      let x = parseInt(( (3 * screenInfo.width) / 4)) - parseInt(windowWidth/2);
      let y = parseInt((screenInfo.height /2)) - parseInt(windowHeight/2);
      window.setPosition(x, y, false);

  }else{
      window.setPosition(position.x, position.y, false);
  }
  window.show();
  window.focus();
}

function closeApp() {
  app.quit();
}

function startApp() {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
    path: app.getPath("exe"),
    args: ["--processStart", "--process-start-args", `"--hidden"`]
  });
  autoUpdater.checkForUpdatesAndNotify();

  if(process.platform === "win32" ){
      // code for window platform
  }else{
      // TODO: check on other platform
      app.dock.hide();
  }

  app.on("ready", () => {
    const translateWindow = createGoogleTranslateWindow();
    const tray = createTray();

    // TODO : Customized control setup
    createSettingsWindow();

    storage.get("userConfig", function(
      error,
      { shortcutKeys = "CommandOrControl+Shift+0" }
    ) {
      if (error) {
        throw error;
      }

      globalShortcut.register(shortcutKeys, () => {
        const text = clipboard.readText();
        translateWindow.loadURL(GOOGLE_TRANSLATE_URL.replace(":text", text));

        ipcMain.emit("show-translate-window");
      });
    });

    ipcMain.on("show-translate-window", () => {
      showWindow(translateWindow, {
        position: tray.getBounds()
      });
    });

    ipcMain.on("hide-translate-window", () => {
      translateWindow.hide();
    });

    ipcMain.on("close-app", () => {
      closeApp();
    });
  });

  app.on("window-all-closed", () => {
    closeApp();
  });
}

module.exports = {
  startApp
};
