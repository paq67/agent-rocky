const { Tray, Menu, nativeImage } = require('electron')
const path = require('path')
const { MODELS } = require('./config')

let tray = null

function createTray(iconPath, modelLabel, mainWindow, showRocky, hideRocky, openPicker, quitApp) {
  const icon = nativeImage.createFromPath(iconPath)
  const resizedIcon = icon.isEmpty() ? nativeImage.createEmpty() : icon.resize({ width: 16, height: 16 })

  tray = new Tray(resizedIcon)
  tray.setToolTip(`Rocky Agent [${modelLabel}]`)

  const modelItems = Object.entries(MODELS).map(([key, model]) => ({
    label: model.label,
    type: 'radio',
    checked: model.label === modelLabel,
    click: () => openPicker(key)
  }))

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Rocky', click: showRocky },
    { label: 'Hide Rocky', click: hideRocky },
    { type: 'separator' },
    { label: 'Switch Model', submenu: modelItems },
    { type: 'separator' },
    { label: 'Quit', click: quitApp }
  ])

  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      hideRocky()
    } else {
      showRocky()
    }
  })

  return tray
}

function updateTrayModel(newModelLabel) {
  if (tray) {
    tray.setToolTip(`Rocky Agent [${newModelLabel}]`)
  }
}

module.exports = { createTray, updateTrayModel }