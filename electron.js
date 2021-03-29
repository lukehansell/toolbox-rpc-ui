const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const { rpc } = require('node-toolbox')

const path = require("path")
const isDev = require("electron-is-dev")

let mainWindow

function eventHandler() {
  ipcMain.on('toMain', (event, arguments) => {
    const { service, functionName, environment, data } = arguments

  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true
    }
  })

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  )
  mainWindow.on("closed", () => (mainWindow = null))
}

app.on("ready", () => {
  createWindow()
  eventHandler()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})
