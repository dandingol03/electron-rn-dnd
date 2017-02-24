/**
 * Created by danding on 17/2/8.
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

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _bridge = require('../bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _windowActions = require('../actions/windowActions');

var _genericActions = require('../actions/genericActions');

var _WindowConstants = require('../../../web/src/constants/ipc/WindowConstants');

var _WindowConstants2 = _interopRequireDefault(_WindowConstants);

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OPEN_PROJECT_DIALOG = _WindowConstants2.default.OPEN_PROJECT_DIALOG,
    SAVE_AS_DIALOG = _WindowConstants2.default.SAVE_AS_DIALOG,
    RESIZE = _WindowConstants2.default.RESIZE,
    OPEN_PATH_CHOOSER_DIALOG = _WindowConstants2.default.OPEN_PATH_CHOOSER_DIALOG;

var WindowHandler = function () {
    function WindowHandler() {
        _classCallCheck(this, WindowHandler);
    }

    _createClass(WindowHandler, [{
        key: 'register',
        value: function register() {
            _bridge2.default.on(OPEN_PROJECT_DIALOG, this.openProjectDialog.bind(this));
            _bridge2.default.on(SAVE_AS_DIALOG, this.saveAsDialog.bind(this));
            _bridge2.default.on(RESIZE, this.resizeWindow.bind(this));
            _bridge2.default.on(OPEN_PATH_CHOOSER_DIALOG, this.openPathChooserDialog.bind(this));
        }
    }, {
        key: 'openProjectDialog',
        value: function openProjectDialog(payload, respond) {
            var selectedPaths = _electron.dialog.showOpenDialog(_electron.BrowserWindow.getFocusedWindow(), {
                title: 'Select Project Directory',
                properties: ['openDirectory'],
                filter: [{ name: 'All Files', extensions: ['*'] }]
            });

            if (!selectedPaths || selectedPaths.length === 0) {
                return;
            }

            //this function respond ->
            respond((0, _windowActions.openProjectDialog)(selectedPaths[0]));
        }
    }, {
        key: 'openPathChooserDialog',
        value: function openPathChooserDialog(payload, respond) {
            if (!payload.propertyType) payload.propertyType = 'openDirectory';
            var selectedPaths = _electron.dialog.showOpenDialog(_electron.BrowserWindow.getFocusedWindow(), {
                title: payload.title || 'Select Path',
                properties: [payload.propertyType],
                filter: [{ name: 'All Files', extensions: ['*'] }]
            });

            if (!selectedPaths || selectedPaths.length === 0) {
                return;
            }

            respond((0, _windowActions.openPathChooserDialog)(selectedPaths[0]));
        }
    }, {
        key: '_cleanBuildDirectory',
        value: function _cleanBuildDirectory(projectPath) {
            var buildDir = _path2.default.join(projectPath, 'ios/build');

            var logsPath = _path2.default.join(buildDir, 'Logs');
            var moduleCache = _path2.default.join(buildDir, 'ModuleCache');
            var infoPlist = _path2.default.join(buildDir, 'info.plist');
            var buildIntermediates = _path2.default.join(buildDir, 'Build/Intermediates');

            _child_process2.default.spawn('rm', ['-rf', logsPath]);
            _child_process2.default.spawn('rm', ['-rf', moduleCache]);
            _child_process2.default.spawn('rm', ['-rf', infoPlist]);
            _child_process2.default.spawn('rm', ['-rf', buildIntermediates]);
        }
    }, {
        key: 'saveAsDialog',
        value: function saveAsDialog(payload, respond) {
            try {
                var currentPath = payload.rootPath;
                var projectPath = _electron.dialog.showSaveDialog(_electron.BrowserWindow.getFocusedWindow(), {
                    title: 'Select a directory to save your project'
                });

                //This likely means no path was specified
                if (!projectPath) {
                    return;
                }

                if (_fsPlus2.default.existsSync(projectPath)) {
                    if (projectPath == currentPath) {
                        respond((0, _windowActions.saveAsDialog)(projectPath));
                        return;
                    }
                    _child_process2.default.spawnSync('rm', ['-rf', projectPath]);
                }

                var child = _child_process2.default.spawnSync('cp', ['-rf', currentPath, projectPath]);

                // We should clean build directories cache, since the path names will have changed
                this._cleanBuildDirectory(projectPath);

                respond((0, _windowActions.saveAsDialog)(projectPath));
            } catch (e) {
                _gulpLogger2.default.error(e);
                respond((0, _genericActions.onError)(SAVE_AS_DIALOG));
            }
        }
    }, {
        key: 'resizeWindow',
        value: function resizeWindow(payload, respond, event) {
            try {
                (function () {
                    var WINDOW_SIZE = _electron2.default.screen.getPrimaryDisplay().workAreaSize;
                    var mainWindow = _electron.BrowserWindow.fromWebContents(event.sender);

                    if (payload.width && payload.height) {
                        mainWindow.setSize(payload.width, payload.height);
                        if (payload.center) {
                            mainWindow.center();
                        } else if (typeof payload.x === 'number' && typeof payload.y === 'number' && payload.x >= 0 && payload.y >= 0) {
                            mainWindow.setPosition(payload.x, payload.y);
                        }
                        if (payload.popResize) {
                            mainWindow.hide();
                            setTimeout(function () {
                                mainWindow.show();
                            }, 500);
                        }
                    } else if (payload.twoThirds) {
                        mainWindow.setPosition(0, 0);
                        mainWindow.setSize(Math.round(WINDOW_SIZE.width / 1.3), Math.round(WINDOW_SIZE.height));
                    } else if (payload.maximize) {
                        mainWindow.setPosition(0, 0);
                        mainWindow.maximize();
                    } else {
                        _gulpLogger2.default.error('resize-window was given incorrect arguments');
                    }
                    respond((0, _genericActions.onSuccess)(RESIZE));
                })();
            } catch (e) {
                _gulpLogger2.default.error(e);
                respond((0, _genericActions.onError)(RESIZE));
            }
        }
    }]);

    return WindowHandler;
}();

var handler = new WindowHandler();
exports.default = handler;