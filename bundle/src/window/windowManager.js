/**
 * Created by danding on 17/2/5.
 */
/**
 *    Copyright (C) 2015 Deco Software Inc.
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

"use strict";

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fileHandler = require('../handlers/fileHandler');

var _fileHandler2 = _interopRequireDefault(_fileHandler);

var _projectHandler = require('../handlers/projectHandler');

var _projectHandler2 = _interopRequireDefault(_projectHandler);

var _DecoDialog = require('../constants/DecoDialog');

var _DecoPaths = require('../constants/DecoPaths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');

var BrowserWindow = require('electron').BrowserWindow; // Module to create native browser window.
var dialog = require('electron').dialog;
var app = require('electron').app;

var gulpLogger = require('../logger/gulpLogger');
//
var upgradeWindow = null;
//


//import upgradeHandler from '../handlers/upgradeHandler'


global.preferencesWindow = null;

var intializeMainWindow = function intializeMainWindow(browserWindow) {

    browserWindow.webContents.session.clearCache(function () {
        //clear cache so updates are shown frequently
    });
    browserWindow.openDevTools();
    browserWindow.hide();
    browserWindow.setTitle('Deco');
    browserWindow.loadURL('file://' + __dirname + '/../../../public/index.html');

    var id = new Date().getTime().toString();
    global.openWindows[id] = browserWindow;

    browserWindow.on('close', function (e) {
        if (!WindowManager.userWantsToClose()) {
            e.preventDefault();
        }
    });

    // Emitted when the window is closed.
    browserWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        delete global.openWindows[id];
        if (global.preferencesWindow) {
            global.preferencesWindow.destroy();
            global.preferencesWindow = null;
        }
    });
};

var WindowManager = {
    getProjectBaseURL: function getProjectBaseURL() {
        var localFile = path.join(_DecoPaths.PUBLIC_FOLDER, '/index.html');
        if (global.__DEV__) {
            return 'http://0.0.0.0:8080/';
        } else {
            return 'file://' + localFile;
        }
    },
    allWindowsClosed: function allWindowsClosed() {
        return _lodash2.default.keys(global.openWindows).length == 0;
    },
    userWantsToClose: function userWantsToClose() {
        var watchedPath = _fileHandler2.default.getWatchedPath();
        if (watchedPath == _DecoPaths.TEMP_PROJECT_FOLDER) {
            return dialog.showMessageBox(_DecoDialog.QUESTION.shouldLoseTemporaryDirectory) == 0;
        }
        if (_projectHandler2.default.hasUnsavedProgress()) {
            return dialog.showMessageBox(_DecoDialog.QUESTION.shouldLoseUnsavedProgress) == 0;
        }

        return true;
    },
    checkNeedsUpgrade: function checkNeedsUpgrade(version) {
        return new Promise(function (resolve, reject) {
            resolve();
            return;
            //TODO:it is not the right time to integrate upgradeHandler
            if (upgradeHandler.needsUpgrade()) {
                upgradeWindow = new BrowserWindow({
                    width: 475,
                    height: 178,
                    show: false,
                    resizable: false,
                    frame: false,
                    title: 'Deco Upgrade',
                    titleBarStyle: 'hidden',
                    closable: 'false',
                    icon: path.join(_DecoPaths.PUBLIC_FOLDER, '/images/deco-icon.png')
                });

                upgradeWindow.setMinimizable(false);
                upgradeWindow.setMaximizable(false);
                upgradeWindow.setFullScreenable(false);

                upgradeWindow.loadURL(WindowManager.getProjectBaseURL() + '#/upgrading');
                var id = new Date().getTime().toString();
                global.openWindows[id] = upgradeWindow;

                upgradeWindow.webContents.on('did-finish-load', function () {
                    upgradeWindow.show();
                    upgradeHandler.upgrade().then(function () {
                        setTimeout(function () {
                            resolve();
                            upgradeWindow.close();
                            delete global.openWindows[id];
                        }, 5000);
                    }).catch(function () {
                        setTimeout(reject, 5000);
                    });
                });
            } else {
                resolve();
            }
        });
    },
    newWindow: function newWindow(width, height, show) {
        return new Promise(function (resolve, reject) {
            var browserWindow = new BrowserWindow({
                width: width || global.workArea.width,
                height: height || global.workArea.height,
                show: show || true,
                titleBarStyle: 'hidden',
                icon: path.join(_DecoPaths.PUBLIC_FOLDER, '/images/logo.png')
            });

            intializeMainWindow(browserWindow);

            browserWindow.webContents.on('did-finish-load', function () {
                resolve(browserWindow);
                browserWindow.show();
            });
        });
    },
    hidePreferencesWindow: function hidePreferencesWindow() {
        preferencesWindow.hide();
    },
    openPreferencesWindow: function openPreferencesWindow() {
        if (global.preferencesWindow) {
            global.preferencesWindow.show();
        }
    },
    initializePreferencesWindow: function initializePreferencesWindow() {

        // Retain reference
        var preferencesWindow = new BrowserWindow({
            width: 450,
            height: 360,
            show: false,
            title: 'Preferences',
            titleBarStyle: 'hidden',
            icon: path.join(_DecoPaths.PUBLIC_FOLDER, '/images/deco-icon.png')
        });

        preferencesWindow.setMinimizable(false);
        preferencesWindow.setMaximizable(false);
        preferencesWindow.setFullScreenable(false);

        preferencesWindow.loadURL(WindowManager.getProjectBaseURL() + '#/preferences');
        preferencesWindow.on('close', function (e) {
            e.preventDefault();
            preferencesWindow.hide();
        });

        global.preferencesWindow = preferencesWindow;
        return preferencesWindow;
    }
};

module.exports = WindowManager;