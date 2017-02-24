'use strict';

var _handlers = require('./src/handlers');

/**
 * Created by danding on 17/2/8.
 */
var app = require('app');
var BrowserWindow = require('browser-window');
var Electron = require('electron');
var gulpLogger = require('./src/logger/gulpLogger');

require('crash-reporter').start();

var WindowManager = require('./src/window/windowManager.js');


var isDevelopment = true;

if (isDevelopment) {
    require('electron-reload')(__dirname, {
        ignored: /node_modules|[\/\\]\./
    });
}

var mainWindow = void 0;

global.openWindows = {};

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {

    var electronScreen = Electron.screen;
    //size equals to the size of your screen
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    //set the work area size for window manager
    global.workArea = size;

    (0, _handlers.registerHandlers)();
    gulpLogger.logger(size.width);

    // mainWindow = new BrowserWindow({width: 1300, height: 650});
    //
    // mainWindow.loadUrl('file://' + __dirname + '/../public/index.html');
    //
    // mainWindow.openDevTools();
    //
    // mainWindow.on('closed', function() {
    //     mainWindow = null;
    // });

    WindowManager.newWindow(600, 450, false).then(function (mainWindow) {});
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});