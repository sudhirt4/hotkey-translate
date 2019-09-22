"use strict";

const { ipcMain, Menu, Tray } = require("electron");
const path = require("path");

function createTray() {
  const tray = new Tray(path.resolve(__dirname, "../assets/flagTemplate.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: () => {
        ipcMain.emit("show-translate-window");
      }
    },
    {
      label: "Quit",
      click: () => {
        ipcMain.emit("close-app");
      }
    }
  ]);

  contextMenu.on("menu-will-show", () => {
    ipcMain.emit("hide-translate-window");
  });

  tray.setToolTip("Easy Translate");
  tray.setContextMenu(contextMenu);

  return tray;
}

module.exports = {
  createTray
};
