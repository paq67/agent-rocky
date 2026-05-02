const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron')
const path = require('path')
const { MODELS, DEFAULT_MODEL } = require('./config')
const { sendToRocky } = require('./chat.js')

let rockyWin, chatWin, pickerWin, tray
let currentModel = DEFAULT_MODEL
let brainTerminated = false
let workArea

function createRockyWindow() {
  rockyWin = new BrowserWindow({
    width: 80,
    height: 100,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  })
  
  rockyWin.loadFile('index.html')
  rockyWin.setAlwaysOnTop(true, 'screen-saver')
  rockyWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  // spawn bottom-left above taskbar
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  rockyWin.setPosition(0, height - 100)

  rockyWin.on('close', (e) => e.preventDefault())

  return rockyWin
}

function createChatWindow() {
  chatWin = new BrowserWindow({
    width: 420,
    height: 520,
    minWidth: 320,
    minHeight: 400,
    resizable: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  chatWin.loadFile('chat.html')
}

function createPickerWindow() {
  const b = rockyWin.getBounds()
  
  pickerWin = new BrowserWindow({
    width: 220,
    height: 170,
    x: b.x,
    y: b.y - 180,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    backgroundColor: '#111111',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  pickerWin.loadFile('model-picker.html')
}

function showPicker() {
  if (!pickerWin || pickerWin.isDestroyed()) {
    createPickerWindow()
  }
  const b = rockyWin.getBounds()
  pickerWin.setPosition(b.x, b.y - 180)
  pickerWin.show()
}

function toggleChat() {
  if (!chatWin || chatWin.isDestroyed()) {
    createChatWindow()
  }
  if (chatWin.isVisible()) {
    chatWin.hide()
  } else {
    chatWin.show()
  }
}

app.whenReady().then(() => {
  createRockyWindow()
  createChatWindow()
  createPickerWindow()

  // Ctrl+Shift+S — Toggle Rocky (Start/Stop)
  const toggleRegistered = globalShortcut.register('CommandOrControl+Shift+S', () => {
    if (rockyWin) {
      rockyWin.webContents.send('rocky-terminate-toggle')
    }
  })
  if (!toggleRegistered) console.warn('Global shortcut Ctrl+Shift+S failed to register.')

  // Ctrl+Shift+W — Easy Access Start (Wake up)
  const wakeRegistered = globalShortcut.register('CommandOrControl+Shift+W', () => {
    if (rockyWin) {
      rockyWin.show()
      rockyWin.webContents.send('rocky-wake')
    }
  })
  if (!wakeRegistered) console.warn('Global shortcut Ctrl+Shift+W failed to register.')

  // Ctrl+Shift+Q — Quit app completely
  const quitRegistered = globalShortcut.register('CommandOrControl+Shift+Q', () => {
    globalShortcut.unregisterAll()
    app.exit(0)
  })
  if (!quitRegistered) console.warn('Global shortcut Ctrl+Shift+Q failed to register.')



  app.focus()
})

app.on('window-all-closed', (e) => e.preventDefault())

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

ipcMain.handle('send-message', async (event, userMessage, history, selectedModel) => {
  try {
    const reply = await sendToRocky(userMessage, history, selectedModel)
    return { ok: true, reply }
  } catch (err) {
    if (err.type === 'EXHAUSTED') return { ok: false, type: 'EXHAUSTED', message: err.message }
    if (err.type === 'NO_KEY')    return { ok: false, type: 'NO_KEY',    message: err.message }
    return { ok: false, type: 'API_ERROR', message: err.message || String(err) }
  }
})

ipcMain.handle('click-exhausted', async () => {
  if (pickerWin) {
    const rockyBounds = rockyWin.getBounds()
    pickerWin.setPosition(rockyBounds.x, rockyBounds.y - 180)
    pickerWin.show()
    pickerWin.focus()
  }
})

ipcMain.handle('select-model', async (event, key) => {
  if (MODELS[key]) {
    currentModel = key
    if (pickerWin) pickerWin.hide()
    if (chatWin) {
      chatWin.show()
      chatWin.focus()
      chatWin.webContents.send('model-changed', { model: key, label: MODELS[key].label })

    }
    return { success: true, model: key, label: MODELS[key].label }
  }
  return { success: false }
})

ipcMain.handle('open-picker', showPicker)
ipcMain.handle('close-picker', () => { if (pickerWin) pickerWin.hide() })
ipcMain.handle('toggle-chat', toggleChat)

ipcMain.handle('get-config', () => {
  const m = MODELS[currentModel]
  return { model: currentModel, label: m.label, color: m.color }
})

ipcMain.handle('move-rocky', (event, x, y) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const clampX = Math.max(0, Math.min(x, width - 80))
  const clampY = Math.max(0, Math.min(y, height - 100))
  rockyWin.setPosition(clampX, clampY)
  return { x: clampX, y: clampY }
})

ipcMain.handle('get-rocky-pos', () => {
  const [x, y] = rockyWin.getPosition()
  return { x, y }
})