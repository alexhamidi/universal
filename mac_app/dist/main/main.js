"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const electron_2 = require("electron");
let mainWindow = null;
let commandPaletteWindow = null;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 0,
        height: 0,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
}
function createCommandPaletteWindow() {
    const { height: screenHeight, width: screenWidth } = electron_2.screen.getPrimaryDisplay().workAreaSize;
    commandPaletteWindow = new electron_1.BrowserWindow({
        width: 600,
        height: 80,
        x: (screenWidth - 600) / 2,
        y: screenHeight - 180, // 100px from top
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        hasShadow: true,
        focusable: false,
        type: 'panel',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    // Set window to be visible on all workspaces
    commandPaletteWindow.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true
    });
    // Make window completely click-through
    commandPaletteWindow.setIgnoreMouseEvents(true);
    // Prevent window from accepting focus
    commandPaletteWindow.setFocusable(false);
    commandPaletteWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    commandPaletteWindow.hide();
    // For development
    // commandPaletteWindow.webContents.openDevTools({ mode: 'detach' });
}
electron_1.app.whenReady().then(() => {
    createMainWindow();
    createCommandPaletteWindow();
    // Register only the toggle shortcut
    electron_1.globalShortcut.register('Command+;', () => {
        if (commandPaletteWindow) {
            if (commandPaletteWindow.isVisible()) {
                commandPaletteWindow.hide();
            }
            else {
                commandPaletteWindow.show();
            }
        }
    });
    // Register global keyboard shortcuts for command palette
    electron_1.globalShortcut.register('Command+Enter', () => {
        if (commandPaletteWindow?.isVisible()) {
            commandPaletteWindow.webContents.send('submit');
        }
    });
    electron_1.globalShortcut.register('Escape', () => {
        if (commandPaletteWindow?.isVisible()) {
            commandPaletteWindow.hide();
            commandPaletteWindow.webContents.send('clear');
        }
    });
});
// Handle IPC messages from renderer
electron_1.ipcMain.on('submit-text', (event, text) => {
    // Handle text submission here
    console.log('Submitted text:', text);
    if (commandPaletteWindow) {
        commandPaletteWindow.hide();
    }
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
        createCommandPaletteWindow();
    }
});
electron_1.app.on('will-quit', () => {
    electron_1.globalShortcut.unregisterAll();
});
