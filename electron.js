const electron = require("electron")
const child_process = require('child_process')
const { rpc } = require('node-toolbox')
const path = require("path")

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const {ipcMain } = electron

let mainWindow

function eventHandler() {
  ipcMain.on('rpcRequest', (_, arguments) => {
    const { service, fn, environment, data } = arguments
    rpc.request({
      service,
      func: fn,
      data: JSON.parse(data),
      environment
    }, (err, result) => {
      console.log(err, result)
      if (err) return mainWindow.webContents.send('rpcError', err)
      mainWindow.webContents.send('rpcResponse', result)
    })
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: false,
      contextIsolation: true
    }
  })

  mainWindow.loadFile('index.html')
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
