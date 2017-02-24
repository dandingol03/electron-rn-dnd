/**
 * Created by danding on 17/2/5.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.buildPathObjects = buildPathObjects;

var _fs2 = require('fs');

var _fs3 = _interopRequireDefault(_fs2);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sane = require('sane');

var _sane2 = _interopRequireDefault(_sane);

var _electron = require('electron');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _fileSystem = require('../fs/fileSystem');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _bridge = require('../bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _fileActions = require('../actions/fileActions');

var _genericActions = require('../actions/genericActions');

var _ErrorConstants = require('../../../web/src/constants/ipc/ErrorConstants');

var _ErrorConstants2 = _interopRequireDefault(_ErrorConstants);

var _FileConstants = require('../../../web/src/constants/ipc/FileConstants');

var _FileConstants2 = _interopRequireDefault(_FileConstants);

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ERROR = _ErrorConstants2.default.ERROR;
var WATCH_PATH = _FileConstants2.default.WATCH_PATH,
    FETCH_SUB_PATH = _FileConstants2.default.FETCH_SUB_PATH,
    WRITE_FILE_DATA = _FileConstants2.default.WRITE_FILE_DATA,
    WRITE_FILE_METADATA = _FileConstants2.default.WRITE_FILE_METADATA,
    DELETE_FILE_METADATA = _FileConstants2.default.DELETE_FILE_METADATA,
    DELETE = _FileConstants2.default.DELETE,
    SHOW_IN_FINDER = _FileConstants2.default.SHOW_IN_FINDER,
    CREATE_DIRECTORY = _FileConstants2.default.CREATE_DIRECTORY,
    RENAME = _FileConstants2.default.RENAME,
    CREATE_FILE = _FileConstants2.default.CREATE_FILE,
    GET_FILE_DATA = _FileConstants2.default.GET_FILE_DATA,
    GET_FILE_METADATA = _FileConstants2.default.GET_FILE_METADATA,
    SAVE_SUCCESSFUL = _FileConstants2.default.SAVE_SUCCESSFUL,
    SHARE_SAVE_STATUS = _FileConstants2.default.SHARE_SAVE_STATUS;


var _watcher = null;
var watchedPath = null;

var pathList = {};

function createMetadataParentPath(filepath) {
    try {
        _fs3.default.stat(_path2.default.dirname(filepath), function (err) {
            if (err) {
                //assume it's because it doesn't exist
                (0, _mkdirp2.default)(_path2.default.dirname(filepath), function (err) {
                    if (err) {
                        _gulpLogger2.default.error(err);
                    }
                });
            }
        });
    } catch (e) {
        _gulpLogger2.default.error(e);
    }
}

//TDOO:figure out how this work
function buildMetadataFilePath(filePath, rootPath) {
    var metadataPath = _path2.default.join(formatPayloadPath(rootPath), '.deco', 'metadata', formatPayloadPath(filePath).replace(rootPath, '') + '.deco');
    _gulpLogger2.default.info('metadataPath=' + metadataPath);
    //检查该路径的目录是否存在,不存在则创建
    createMetadataParentPath(metadataPath);
    return metadataPath;
}

function shouldEmitChangesForPath(filePath) {
    if (_path2.default.extname(filePath) === '.deco') {
        return false;
    }

    if (_path2.default.basename(filePath) === '.deco') {
        return false;
    }

    return true;
}

function closeWatchman() {
    if (!_watcher) return;
    try {
        _watcher.close();
    } catch (e) {
        _gulpLogger2.default.error(e);
    }
}

function shutdownWatchman() {
    try {
        // this should only be the case if we added watchman to the $PATH on initialization
        if (process.env.PATH.indexOf('/usr/local/Deco/watchman') != -1) {
            _child_process2.default.spawnSync('/usr/local/Deco/watchman/watchman', ['shutdown-server']);
        }
    } catch (e) {
        //do nothing
        _gulpLogger2.default.error(e);
    }
}

process.on('exit', function () {
    closeWatchman();
    shutdownWatchman();
});

process.on('SIGTERM', function () {
    closeWatchman();
    shutdownWatchman();
});

function buildPathObjects(absolutePath) {
    var buffer = new Buffer(absolutePath);
    var id = buffer.toString('hex');
    var baseName = _path2.default.basename(absolutePath);
    var pathArray = absolutePath.split(_path2.default.sep);
    //slice the first argument which is
    return {
        absolutePathArray: pathArray.slice(1, pathArray.length),
        baseName: baseName,
        id: id
    };
}

//接收过来的id是以hex编码的路径,需要转换成String
function getPathFromId(id) {
    var buf = new Buffer(id, 'hex');
    return buf.toString();
}

function verifyPayload(payload) {
    if (!payload.path) {
        throw 'payload path is required, but found missing';
    }

    return true;
}

function formatPayloadPath(payloadPath) {
    //assuming its an array, shipped back from renderer
    if (typeof payloadPath != 'string') {
        return [''].concat(payloadPath).join(_path2.default.sep);
    }
    return payloadPath;
}

var FileHandler = function () {
    function FileHandler() {
        _classCallCheck(this, FileHandler);
    }

    _createClass(FileHandler, [{
        key: 'getWatchedPath',
        value: function getWatchedPath() {
            return watchedPath;
        }
    }, {
        key: 'register',
        value: function register() {
            _bridge2.default.on(WATCH_PATH, this.watchPath.bind(this));
            _bridge2.default.on(FETCH_SUB_PATH, this.asyncListSubPaths.bind(this));
            _bridge2.default.on(WRITE_FILE_DATA, this.writeFileData.bind(this));
            _bridge2.default.on(WRITE_FILE_METADATA, this.writeFileMetadata.bind(this));
            _bridge2.default.on(DELETE_FILE_METADATA, this.deleteFileMetadata.bind(this));
            _bridge2.default.on(DELETE, this.delete.bind(this));
            _bridge2.default.on(SHOW_IN_FINDER, this.showInFinder.bind(this));
            _bridge2.default.on(CREATE_DIRECTORY, this.createDirectory.bind(this));
            _bridge2.default.on(RENAME, this.rename.bind(this));
            _bridge2.default.on(CREATE_FILE, this.createFile.bind(this));
            _bridge2.default.on(GET_FILE_DATA, this.readFileData.bind(this));
            _bridge2.default.on(GET_FILE_METADATA, this.readFileMetadata.bind(this));
        }
    }, {
        key: 'createFile',
        value: function createFile(payload, respond) {
            try {
                (function () {
                    var absolutePath = getPathFromId(payload.id);
                    //absolute path is that of the parent directory
                    var filePath = _path2.default.join(absolutePath, payload.filename);
                    _fs3.default.writeFile(filePath, payload.data, {
                        mode: '0755'
                    }, function (err) {
                        if (err) {
                            _gulpLogger2.default.error(err);
                            respond((0, _genericActions.onError)('Failed to create new file'));
                            return;
                        }
                        var pathObj = buildPathObjects(filePath);
                        respond((0, _fileActions.onFileCreated)(pathObj, payload.data));
                    });
                })();
            } catch (e) {}
        }
    }, {
        key: 'rename',
        value: function rename(payload, respond) {
            try {
                var absolutePath = getPathFromId(payload.id);
                var newPath = _path2.default.join(_path2.default.dirname(absolutePath), payload.newName);
                _fsPlus2.default.moveSync(absolutePath, newPath);
                var pathObj = buildPathObjects(newPath);
                respond((0, _fileActions.onRename)(pathObj));
            } catch (e) {
                _gulpLogger2.default.error(e);
                respond((0, _genericActions.onError)('Rename operation was unsuccessful'));
            }
        }
    }, {
        key: 'delete',
        value: function _delete(payload, respond) {
            try {
                var absolutePath = getPathFromId(payload.id);
                if (payload.fileType == 'dir') {
                    // FileSystem.deleteDirectoryRecursivelySync(absolutePath)
                    _child_process2.default.exec('rm -r ' + absolutePath);
                } else {
                    _fs3.default.unlink(absolutePath, function (err) {
                        if (err) {
                            _gulpLogger2.default.error(err);
                        }
                    });
                }
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
            respond((0, _genericActions.onSuccess)(DELETE));
        }
    }, {
        key: 'showInFinder',
        value: function showInFinder(payload, respond) {
            try {
                var absolutePath = getPathFromId(payload.id);
                _gulpLogger2.default.error(absolutePath);
                _electron.shell.showItemInFolder(absolutePath);
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
            respond((0, _genericActions.onSuccess)(SHOW_IN_FINDER));
        }
    }, {
        key: 'createDirectory',
        value: function createDirectory(payload, respond) {
            try {
                var absolutePath = getPathFromId(payload.id);
                var newPath = _path2.default.join(absolutePath, payload.dirname);
                _fs3.default.mkdir(newPath, function (err) {
                    if (err) {
                        _gulpLogger2.default.error(err);
                    }
                });
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
            respond((0, _genericActions.onSuccess)(CREATE_DIRECTORY));
        }

        //当WebContent发出GET_FILE_DATA时，bridge的响应函数
        //payload.path是字符串的数组,需要把它规范化后读出

    }, {
        key: 'readFileData',
        value: function readFileData(payload, respond) {
            try {

                //verifyPayload,check if field 'path' is valid
                verifyPayload(payload);
                _gulpLogger2.default.info('path of payload =' + payload.path);
                payload.path = formatPayloadPath(payload.path);
                if (!payload) return;

                _fileSystem2.default.readFile(payload.path, {
                    success: function success(data) {
                        var pathObj = buildPathObjects(payload.path);
                        //将该文件的绝对路径存入pathList,TODO:判断是否该变量全局
                        pathList[payload.path] = true;
                        respond((0, _fileActions.onFileData)(pathObj, data.toString('utf8')));
                    }, error: function error(err) {
                        respond((0, _genericActions.onError)(err));
                    }
                });
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }

        //desktop,获取文件的元信息

    }, {
        key: 'readFileMetadata',
        value: function readFileMetadata(payload, respond) {
            try {
                verifyPayload(payload);
                payload.path = buildMetadataFilePath(getPathFromId(payload.path), payload.rootPath);
                if (!payload) return;
                _fileSystem2.default.readFile(payload.path, {
                    success: function success(data) {
                        var pathObj = buildPathObjects(payload.path);
                        pathList[payload.path] = true;
                        _gulpLogger2.default.info('metadata=\r\n' + data);
                        respond((0, _fileActions.onFileMetadata)(pathObj, data.toString('utf8')));
                    }, error: function error(err) {
                        respond((0, _genericActions.onError)(err));
                    }
                });
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: 'writeFileData',
        value: function writeFileData(payload, respond) {
            try {
                if (!payload.id) return;
                var absolutePath = getPathFromId(payload.id);
                _fileSystem2.default.writeFile(absolutePath, payload.data, {
                    success: function success() {
                        respond((0, _genericActions.onSuccess)(WRITE_FILE_DATA));
                        _bridge2.default.send((0, _fileActions.confirmSave)(payload.id));
                    }, error: function error(err) {
                        _gulpLogger2.default.error(err);
                        respond((0, _genericActions.onError)(err));
                        return;
                    }
                });
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: 'writeFileMetadata',
        value: function writeFileMetadata(payload, respond) {
            try {
                if (!payload.id) return;
                var absolutePath = buildMetadataFilePath(getPathFromId(payload.id), payload.rootPath);
                _fileSystem2.default.writeFile(absolutePath, payload.metadata, {
                    success: function success() {
                        respond((0, _genericActions.onSuccess)(WRITE_FILE_METADATA));
                        _bridge2.default.send((0, _fileActions.confirmSave)(payload.id));
                    }, error: function error(err) {
                        _gulpLogger2.default.error(err);
                        respond((0, _genericActions.onError)(err));
                        return;
                    }
                });
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: 'deleteFileMetadata',
        value: function deleteFileMetadata(payload, respond) {
            try {
                if (!payload.id) return;
                var absolutePath = buildMetadataFilePath(getPathFromId(payload.id), payload.rootPath);
                _fileSystem2.default.deleteFile(absolutePath, {
                    success: function success() {
                        respond((0, _genericActions.onSuccess)(DELETE_FILE_METADATA));
                    }, error: function error(err) {
                        _gulpLogger2.default.error(err);
                        respond((0, _genericActions.onError)(err));
                    }
                });
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: 'watchPath',
        value: function watchPath(payload, respond) {
            var _this = this;

            var rootPath = payload.rootPath;
            watchedPath = rootPath;
            var removeQueue = [];
            var _batchRemoval = _lodash2.default.debounce(function () {
                _bridge2.default.send((0, _fileActions.removeSubPathBatch)(removeQueue.slice()));
                removeQueue = [];
            }, 1000);

            try {
                _watcher = (0, _sane2.default)(rootPath, {
                    watchman: true
                });

                _watcher.on('error', function (error) {
                    _gulpLogger2.default.error(error);
                    //try to relaunch every 10sec
                    setTimeout(_this.watchPath.bind(_this, { rootPath: rootPath }, function () {
                        return; //just pass mock callback
                    }), 10000);
                });

                _watcher.on('add', function (filepath, root, stat) {
                    if (!shouldEmitChangesForPath(filepath)) {
                        return;
                    }

                    var absolutePath = _path2.default.join(root, filepath);
                    if (pathList[_path2.default.dirname(absolutePath)]) {
                        _this.asyncListSubPaths({ path: absolutePath, isCollapsed: true }, function (resp) {
                            if (resp.type != ERROR) {
                                _bridge2.default.send(resp);
                            }
                        });
                    }
                });
                _watcher.on('change', function (filepath, root, stat) {
                    if (!shouldEmitChangesForPath(filepath)) {
                        return;
                    }

                    var absolutePath = _path2.default.join(root, filepath);
                    if (!_fsPlus2.default.isDirectorySync(absolutePath)) {
                        if (pathList[absolutePath]) {
                            //TODO at the moment, we cannot update code if changed externally
                        }
                    }
                });
                _watcher.on('delete', function (filepath, root, stat) {
                    if (!shouldEmitChangesForPath(filepath)) {
                        return;
                    }

                    var absolutePath = _path2.default.join(root, filepath);
                    if (pathList[root]) {
                        _this.asyncRemoveSubPaths({ path: absolutePath }, function (resp) {
                            if (resp.type != ERROR) {
                                removeQueue.push(resp);
                                _batchRemoval();
                            }
                        });
                    }
                });
            } catch (e) {
                _gulpLogger2.default.error(e);
                respond((0, _genericActions.onError)(WATCH_PATH));
                return;
            }

            respond((0, _genericActions.onSuccess)(WATCH_PATH));
        }
    }, {
        key: 'asyncRemoveSubPaths',
        value: function asyncRemoveSubPaths(payload, respond) {
            try {
                verifyPayload(payload);
                payload.path = formatPayloadPath(payload.path);
                // remove if path exists
                // this function may also be called from renderer as a command to delete
                // or it may be called as a response to cleanup from an external remove
                if (_fsPlus2.default.existsSync(payload.path)) {
                    _fsPlus2.default.removeSync(payload.path);
                }

                if (pathList[payload.path]) {
                    delete pathList[payload.path];
                }
                var pathObject = buildPathObjects(payload.path);
                respond((0, _fileActions.removeSubPath)(pathObject));
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }, {
        key: '_asyncListDir',
        value: function _asyncListDir(parentId, absolutePath, queue, respond) {
            //function returns falsy if the directory is not entered
            //this happens if an empty directory is being listed
            return _fsPlus2.default.traverseTree(absolutePath, function (filePath) {
                if (!shouldEmitChangesForPath(filePath)) {
                    return;
                }

                var pathObject = buildPathObjects(filePath);
                queue.push((0, _fileActions.addSubPath)(pathObject, 'file'));
                // FileBridge.queueSubPathBatch(pathObject, 'file', queue)
            }, function (directoryPath) {
                if (!shouldEmitChangesForPath(directoryPath)) {
                    return;
                }
                var pathObject = buildPathObjects(directoryPath);
                queue.push((0, _fileActions.addSubPath)(pathObject, 'dir'));
                return false;
            }, function () {
                respond((0, _fileActions.addSubPathBatch)(queue));
            });
        }
    }, {
        key: 'asyncListSubPaths',
        value: function asyncListSubPaths(payload, respond) {
            try {
                verifyPayload(payload);
                payload.path = formatPayloadPath(payload.path);
                if (!payload) return; // TODO: this will error. what's intended?

                if (!shouldEmitChangesForPath(payload.path)) {
                    return;
                }

                var pathObj = buildPathObjects(payload.path);
                if (_fsPlus2.default.isDirectorySync(payload.path)) {
                    var queue = [];
                    queue.push((0, _fileActions.addSubPath)(pathObj, 'dir'));
                    if (!payload.isCollapsed) {
                        pathList[payload.path] = true;
                    }
                    if (!this._asyncListDir(pathObj.id, payload.path, queue, respond)) {
                        // this case handles when an empty directory is queued
                        // TODO bridge??
                        _bridge2.default.send((0, _fileActions.addSubPathBatch)(queue));
                    }
                } else {
                    respond((0, _fileActions.addSubPathBatch)([(0, _fileActions.addSubPath)(pathObj, 'file')]));
                }
            } catch (e) {
                _gulpLogger2.default.error(e);
            }
        }
    }]);

    return FileHandler;
}();

var handler = new FileHandler();
exports.default = handler;