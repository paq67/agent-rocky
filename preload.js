const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('rocky', {
  sendMessage:        (msg, history, model) => ipcRenderer.invoke('send-message', msg, history, model),
  selectModel:        (key)  => ipcRenderer.invoke('select-model', key),
  openPicker:         ()     => ipcRenderer.invoke('open-picker'),
  closePicker:        ()     => ipcRenderer.invoke('close-picker'),
  toggleChat:         ()     => ipcRenderer.invoke('toggle-chat'),
  getConfig:          ()     => ipcRenderer.invoke('get-config'),
  getRockyPos:        ()     => ipcRenderer.invoke('get-rocky-pos'),
  moveRocky:          (x, y) => ipcRenderer.invoke('move-rocky', x, y),
  clickExhausted:     ()     => ipcRenderer.invoke('click-exhausted'),
  onReply:            (cb)   => ipcRenderer.on('rocky-reply',            (_, d) => cb(d)),
  onModelChange:      (cb)   => ipcRenderer.on('model-changed',          (_, d) => cb(d)),
  onTerminateToggle:  (cb)   => ipcRenderer.on('rocky-terminate-toggle', ()    => cb()),
  onWake:             (cb)   => ipcRenderer.on('rocky-wake',             ()    => cb()),
})