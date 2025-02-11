const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // Removido fullscreen: true
        autoHideMenuBar: true, // Ocultar a barra de menu (opcional)
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Maximizar a janela ao iniciar
    //mainWindow.maximize();

    mainWindow.loadFile('./src/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});