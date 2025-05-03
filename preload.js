// preload.js
const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data)
  },

contextBridge.exposeInMainWorld('Notification', class {
  constructor(title, options) {
    ipcRenderer.invoke('notify', { title, ...options });
  }

  static requestPermission() {
    return Promise.resolve('granted'); // Fake it!
  }

  static get permission() {
    return 'granted';
  }
});




window.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    try {
      const url = new URL(href);
      const allowed = ['http:', 'https:', 'mailto:'];
      if (allowed.includes(url.protocol)) {
        e.preventDefault();
        shell.openExternal(href);
      }
    } catch {}
  });
});
