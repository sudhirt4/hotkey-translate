"use strict";

const { app, ipcMain, globalShortcut, clipboard } = require("electron");
const { autoUpdater } = require("electron-updater");

const { createGoogleTranslateWindow } = require("./googleTranslateWindow");
const { createTray } = require("./tray");
const { GOOGLE_TRANSLATE_URL } = require("./config");
const { DEFAULT_HOTKEY } = require("./config");

function showWindow(window, { position }) {
  window.setPosition(position.x, position.y, false);
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

  app.on("ready", () => {
    app.dock.hide();

    const translateWindow = createGoogleTranslateWindow();
    const tray = createTray();

    globalShortcut.register(DEFAULT_HOTKEY, () => {
      const text = clipboard.readText();
      translateWindow.loadURL(GOOGLE_TRANSLATE_URL.replace(":text", text));

      ipcMain.emit("show-translate-window");
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
