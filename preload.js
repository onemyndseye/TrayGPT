// preload.js
const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data)
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
