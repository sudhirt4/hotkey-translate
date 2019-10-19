"use strict";

const { ipcMain, Menu, Tray } = require("electron");
const path = require("path");

function createTray() {
  const tray = new Tray(path.resolve(__dirname, "../assets/flagTemplate.png"));

  const template = [
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
  ];

  const contextMenu = Menu.buildFromTemplate(template);

  contextMenu.on("menu-will-show", () => {
    ipcMain.emit("hide-translate-window");
  });

  tray.setToolTip("Hotkey Translate");
  tray.setContextMenu(contextMenu);

  return tray;
}

module.exports = {
  createTray
};
