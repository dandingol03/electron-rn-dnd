/**
 * Created by danding on 17/2/9.
 * 1.module mkdirp: mkdirp('/a/b/c/d'
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _mv = require('mv');

var _mv2 = _interopRequireDefault(_mv);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bridge = require('../bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _genericActions = require('../actions/genericActions');

var _projectActions = require('../actions/projectActions');

var _ProjectConstants = require('../../../web/src/constants/ipc/ProjectConstants');

var _ProjectConstants2 = _interopRequireDefault(_ProjectConstants);

var _DecoPaths = require('../constants/DecoPaths');

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CREATE_NEW_PROJECT = _ProjectConstants2.default.CREATE_NEW_PROJECT,
    OPEN_PROJECT = _ProjectConstants2.default.OPEN_PROJECT,
    SHARE_SAVE_STATUS = _ProjectConstants2.default.SHARE_SAVE_STATUS;

//import SimulatorController from '../process/simulatorController'
//import PackagerController from '../process/packagerController'

var unsavedMap = {};

var PROJECT_SETTINGS_TEMPLATE = '{\n\n  // relative path from project root to the .app binary that is generated after building iOS\n  "iosTarget": "ios/build/Build/Products/Debug-iphonesimulator/Project.app",\n\n  // relative path from project root to the xcode project or workspace file for iOS build\n  "iosProject": "ios/Project.xcodeproj",\n\n  // scheme name to use when building in Deco\n  "iosBuildScheme": "Project",\n\n  // relative path from project to the AndroidManifest.xml file for your application\n  "androidManifest": "android/app/src/main/AndroidManifest.xml",\n\n  // port for the packager to run on\n  "packagerPort": 8081\n}';

var ProjectHandler = function () {
    function ProjectHandler() {
        _classCallCheck(this, ProjectHandler);
    }

    _createClass(ProjectHandler, [{
        key: 'hasUnsavedProgress',
        value: function hasUnsavedProgress() {
            return _lodash2.default.keys(unsavedMap).length != 0;
        }
    }, {
        key: 'register',
        value: function register() {
            _bridge2.default.on(CREATE_NEW_PROJECT, this.createNewProject.bind(this));
            _bridge2.default.on(OPEN_PROJECT, this.openProject.bind(this));
            _bridge2.default.on(SHARE_SAVE_STATUS, this.updateSaveStatus.bind(this));
        }
    }, {
        key: 'updateSaveStatus',
        value: function updateSaveStatus(payload, respond) {
            try {
                if (payload.status) {
                    unsavedMap[payload.id] = payload.status;
                } else {
                    delete unsavedMap[payload.id];
                }
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
            respond((0, _genericActions.onSuccess)(SHARE_SAVE_STATUS));
        }
    }, {
        key: '_deleteProject',
        value: function _deleteProject(root) {
            var deletePath = root + '.delete';
            try {
                _fs2.default.statSync(root);
            } catch (e) {
                // Trying to delete a project that does not exist eh?
                _gulpLogger2.default.error(e);
                return;
            }
            try {
                _fsPlus2.default.moveSync(root, deletePath);
                _child_process2.default.spawn('rm', ['-rf', deletePath]);
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: 'cleanBuildDir',
        value: function cleanBuildDir(root) {
            try {
                var pathsToClean = [_path2.default.join(root, 'ios/build/ModuleCache'), _path2.default.join(root, 'ios/build/info.plist'), _path2.default.join(root, 'ios/build/Build/Intermediates')];
                _lodash2.default.each(pathsToClean, function (filename) {
                    _child_process2.default.spawn('rm', ['-rf', filename]);
                });
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: '_createTemplateFolder',
        value: function _createTemplateFolder() {
            return new Promise(function (resolve, reject) {
                try {
                    _child_process2.default.spawn('cp', ['-rf', _path2.default.join(_DecoPaths.LIB_PROJECT_FOLDER), _DecoPaths.TEMP_PROJECT_FOLDER_TEMPLATE]).on('close', function (code) {
                        if (code != 0) {
                            _gulpLogger2.default.error('Project template creation exited with code: ' + code);
                            reject();
                        } else {
                            resolve();
                        }
                    });
                } catch (e) {
                    _gulpLogger2.default.error(e);
                    return;
                }
            });
        }
    }, {
        key: '_resetProcessState',
        value: function _resetProcessState() {
            try {
                //TODO:it is not the right time to integration that
                //SimulatorController.clearLastSimulator()
                //PackagerController.killPackager()
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: 'createNewProject',
        value: function createNewProject(payload, respond) {
            var _this = this;

            this._resetProcessState();
            try {
                var _ret = function () {
                    payload.path = _DecoPaths.TEMP_PROJECT_FOLDER;
                    _this._deleteProject(payload.path);
                    var createProj = function createProj() {
                        _fs2.default.rename(_DecoPaths.TEMP_PROJECT_FOLDER_TEMPLATE, _DecoPaths.TEMP_PROJECT_FOLDER, function (err) {
                            if (err) {
                                _gulpLogger2.default.error(err);
                                respond((0, _genericActions.onError)(err));
                                return;
                            }
                            respond((0, _genericActions.onSuccess)(CREATE_NEW_PROJECT));
                            _bridge2.default.send((0, _projectActions.setProject)(payload.path, payload.tmp));
                            _this._createTemplateFolder();
                            _this.createProjectSettingsTemplate(payload.path);
                        });
                        unsavedMap = {};
                    };

                    try {
                        _fs2.default.statSync(_DecoPaths.TEMP_PROJECT_FOLDER_TEMPLATE);
                    } catch (e) {
                        _this._createTemplateFolder().then(function () {
                            createProj();
                        });
                        return {
                            v: void 0
                        };
                    }
                    createProj();
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: 'createProjectSettingsTemplate',
        value: function createProjectSettingsTemplate(rootPath) {
            return new Promise(function (resolve, reject) {
                var metadataPath = _path2.default.join(rootPath, '.deco');
                var settingsFilePath = _path2.default.join(metadataPath, '.settings');
                try {
                    _fs2.default.statSync(settingsFilePath);
                    resolve(settingsFilePath);
                } catch (e) {
                    if (e && e.code == 'ENOENT') {
                        (0, _mkdirp2.default)(metadataPath, function () {
                            try {
                                _fs2.default.writeFileSync(settingsFilePath, PROJECT_SETTINGS_TEMPLATE, {
                                    mode: '755'
                                });
                                resolve(settingsFilePath);
                            } catch (e) {
                                //could not write out the file
                                _gulpLogger2.default.error('Failed to write settings file template', e);
                                reject();
                            }
                        });
                    } else {
                        _gulpLogger2.default.error(e);
                        reject();
                    }
                }
            });
        }

        /**
         * Backwards compatability!
         */

    }, {
        key: 'updateOldProjectStructure',
        value: function updateOldProjectStructure(rootPath) {
            var oldMetadata = _path2.default.join(rootPath, '.deco');
            var list = _fs2.default.readdirSync(oldMetadata);
            _lodash2.default.each(list, function (sub) {
                var oldPath = _path2.default.join(oldMetadata, sub);
                var newPath = _path2.default.join(oldMetadata, 'metadata', sub);
                (0, _mv2.default)(oldPath, newPath, { mkdirp: true }, function (err) {
                    if (err) {
                        _gulpLogger2.default.error(err);
                    }
                });
            });
            // add .settings file
            this.createProjectSettingsTemplate(rootPath);
        }

        /**
         * Backwards compatability!
         */

    }, {
        key: 'checkOldProjectStructure',
        value: function checkOldProjectStructure(rootPath) {
            var _this2 = this;

            var oldMetadataPath = _path2.default.join(rootPath, '.deco');
            var newMetadataPath = _path2.default.join(oldMetadataPath, 'metadata');
            _fs2.default.stat(oldMetadataPath, function (err, stats) {
                if (err) {
                    //project is clean
                    _this2.createProjectSettingsTemplate(rootPath);
                    return;
                }

                _fs2.default.stat(newMetadataPath, function (err, stats) {
                    if (!err) {
                        _this2.createProjectSettingsTemplate(rootPath);
                        return; //project is current
                    }
                    if (err.code == 'ENOENT') {
                        //this is an old project structure
                        _this2.updateOldProjectStructure(rootPath);
                    } else {
                        _gulpLogger2.default.error(err);
                        return; //something went wrong
                    }
                });
            });
        }

        //当用户通过弹出框选择了工程后,会再次发送消息给mainProcess打开工程

    }, {
        key: 'openProject',
        value: function openProject(payload, respond) {
            _gulpLogger2.default.info('=====get openProject:action');
            //如果用户此行为为状态恢复
            if (!payload.resumeState) {
                this._resetProcessState();
            }
            unsavedMap = {};
            console.log('the path of payload=' + payload.path);
            //TODO:statement below encounter error
            try {
                var ob = (0, _projectActions.setProject)(payload.path, false);
            } catch (e) {
                _gulpLogger2.default.info(e.toString());
            }
            _gulpLogger2.default.info('absolutePath=' + ob.absolutePath);
            _bridge2.default.send(ob);
            this.checkOldProjectStructure(payload.path);
            //用户client发出的异步回调
            respond((0, _genericActions.onSuccess)(OPEN_PROJECT));
        }
    }]);

    return ProjectHandler;
}();

var handler = new ProjectHandler();
exports.default = handler;