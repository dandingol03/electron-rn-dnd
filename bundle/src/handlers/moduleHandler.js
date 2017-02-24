'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by danding on 17/2/14.
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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _nodeDir = require('node-dir');

var _nodeDir2 = _interopRequireDefault(_nodeDir);

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

var _npmController = require('../process/npmController');

var _npmController2 = _interopRequireDefault(_npmController);

var _bridge = require('../bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _genericActions = require('../actions/genericActions');

var _uiActions = require('../../../web/src/actions/uiActions');

var _moduleActions = require('../../../web/src/actions/moduleActions');

var _ModuleConstants = require('../../../web/src/constants/ipc/ModuleConstants');

var _ModuleConstants2 = _interopRequireDefault(_ModuleConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModuleHandler = function () {
    function ModuleHandler() {
        _classCallCheck(this, ModuleHandler);
    }

    _createClass(ModuleHandler, [{
        key: 'register',
        value: function register() {
            _bridge2.default.on(_ModuleConstants2.default.IMPORT_MODULE, this.importModule.bind(this));
            _bridge2.default.on(_ModuleConstants2.default.SCAN_PROJECT_FOR_REGISTRIES, this.scanPathForRegistries.bind(this));
        }
    }, {
        key: 'readPackageJSON',
        value: function readPackageJSON(projectPath) {
            var packagePath = _path2.default.join(projectPath, 'package.json');
            return new Promise(function (resolve, reject) {
                try {
                    _jsonfile2.default.readFile(packagePath, function (err, obj) {
                        if (err && err.code !== 'ENOENT') {
                            _gulpLogger2.default.info('Failed to read package.json');
                            _gulpLogger2.default.error(err);
                            reject(err);
                        } else {
                            resolve(obj);
                        }
                    });
                } catch (e) {
                    _gulpLogger2.default.error(e);
                    reject(e);
                }
            });
        }

        /**
         * Return a map of {filepath => package.json contents}
         * @param  {String} dirname Directory to scan
         * @return {Promise}
         */

    }, {
        key: 'readAllPackageJSON',
        value: function readAllPackageJSON(dirname) {
            return new Promise(function (resolve, reject) {
                var data = {};

                var onReadFile = function onReadFile(err, content, filepath, next) {
                    if (err) {
                        return next();
                    }

                    try {
                        data[filepath] = JSON.parse(content);
                    } catch (e) {
                        return next();
                    }

                    return next();
                };

                var onComplete = function onComplete(err, files) {
                    if (err) {
                        return reject();
                    }

                    resolve(data);
                };

                var options = {
                    match: /package.json$/,
                    // For now, limit to just searching this project's package.json
                    excludeDir: /node_modules/,
                    matchFullName: true
                };

                try {
                    //dir alias of 'node-dir'
                    _nodeDir2.default.readFiles(dirname, options, onReadFile, onComplete);
                } catch (err) {
                    _gulpLogger2.default.error(err);
                }
            });
        }
    }, {
        key: 'readAllComponentLists',
        value: function readAllComponentLists(dirname) {
            var _this = this;

            dirname = _path2.default.resolve(dirname);

            return this.readAllPackageJSON(dirname).then(function (packageMap) {
                var registries = {};

                // Build a new map, {filepath => components}, filtering out any package.json
                // which doesn't contain components
                _lodash2.default.each(packageMap, function (json, filepath) {
                    var registry = _lodash2.default.get(json, 'deco.components');

                    if (registry) {
                        registries[filepath] = registry;
                    }
                });

                return registries;
            }).then(function (registryMap) {

                // Resolve any local paths e.g. './component.js' to absolute paths
                return _lodash2.default.mapValues(registryMap, function (components, filepath) {
                    return _this.resolveLocalPathsInComponents(_path2.default.dirname(filepath), components);
                });
            });
        }
    }, {
        key: 'resolveLocalPathsInComponents',
        value: function resolveLocalPathsInComponents(parentPath, components) {

            var resolve = function resolve(component, property) {
                var value = _lodash2.default.get(component, property);

                if (typeof value === 'string' && value.startsWith('./')) {
                    _lodash2.default.set(component, property, _path2.default.join(parentPath, value));
                }
            };

            _lodash2.default.each(components, function (component) {
                resolve(component, 'template.text');
                resolve(component, 'template.metadata');
            });

            return components;
        }

        //读取所有组件

    }, {
        key: 'scanPathForRegistries',
        value: function scanPathForRegistries(_ref, respond) {
            var path = _ref.path;

            this.readAllComponentLists(path).then(function (registryMap) {
                respond((0, _moduleActions.foundRegistries)(registryMap));
            });
        }
    }, {
        key: 'importModule',
        value: function importModule(options, respond) {

            options.version = options.version || 'latest';

            var name = options.name,
                version = options.version,
                installPath = options.path;


            this.readPackageJSON(options.path).then(function () {
                var packageJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var dependencies = packageJSON.dependencies;

                // If the dependency exists, and the version is compatible

                if (dependencies && dependencies[name] && (version === '*' || version === dependencies[name])) {
                    _gulpLogger2.default.info('npm: dependency ' + name + '@' + version + ' already installed');
                    respond((0, _genericActions.onSuccess)(_ModuleConstants2.default.IMPORT_MODULE));
                } else {
                    (function () {
                        var progressCallback = _lodash2.default.throttle(function (percent) {
                            _bridge2.default.send((0, _uiActions.updateProgressBar)(name, percent * 100));
                        }, 250);

                        _bridge2.default.send((0, _uiActions.startProgressBar)(name, 0));

                        try {
                            var command = ['install', '-S', name + '@' + version].concat(_toConsumableArray(options.registry && ['--registry', options.registry]));

                            _gulpLogger2.default.info('npm ' + command.join(' '));

                            _npmController2.default.run(command, { cwd: installPath }, function (err) {

                                // Ensure a trailing throttled call doesn't fire
                                progressCallback.cancel();

                                _bridge2.default.send((0, _uiActions.endProgressBar)(name, 100));

                                if (err) {
                                    _gulpLogger2.default.info('npm: dependency ' + name + '@' + version + ' failed to install');
                                    respond((0, _genericActions.onError)(_ModuleConstants2.default.IMPORT_MODULE));
                                } else {
                                    _gulpLogger2.default.info('npm: dependency ' + name + '@' + version + ' installed successfully');
                                    respond((0, _genericActions.onSuccess)(_ModuleConstants2.default.IMPORT_MODULE));
                                }
                            }, progressCallback);
                        } catch (e) {
                            _gulpLogger2.default.error(e);
                            respond((0, _genericActions.onError)(_ModuleConstants2.default.IMPORT_MODULE));
                        }
                    })();
                }
            });
        }
    }]);

    return ModuleHandler;
}();

exports.default = new ModuleHandler();