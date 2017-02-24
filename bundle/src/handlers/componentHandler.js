/**
 * Created by danding on 17/2/18.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _fileSystem = require('../fs/fileSystem');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _bridge = require('../bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _ComponentConstants = require('../../../web/src/constants/ipc/ComponentConstants');

var _ComponentConstants2 = _interopRequireDefault(_ComponentConstants);

var _ErrorConstants = require('../../../web/src/constants/ipc/ErrorConstants');

var _ErrorConstants2 = _interopRequireDefault(_ErrorConstants);

var _genericActions = require('../actions/genericActions');

var _componentActions = require('../actions/componentActions');

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var child_process = require('child_process');

var IMPORT_COMPONENT = _ComponentConstants2.default.IMPORT_COMPONENT,
    GET_COMPONENT_LIST = _ComponentConstants2.default.GET_COMPONENT_LIST;
var ERROR = _ErrorConstants2.default.ERROR;


var CACHE_FOLDER = require('../constants/DecoPaths').CACHE_FOLDER;

var ComponentHandler = function () {
    function ComponentHandler() {
        _classCallCheck(this, ComponentHandler);
    }

    _createClass(ComponentHandler, [{
        key: 'register',
        value: function register() {
            _bridge2.default.on(IMPORT_COMPONENT, this.getComponentList.bind(this));
            _bridge2.default.on(GET_COMPONENT_LIST, this.getComponentList.bind(this));
        }
    }, {
        key: '_verifyOrCreateComponentFolder',
        value: function _verifyOrCreateComponentFolder(rootPath) {
            var compFolderPath = _path2.default.join(rootPath, 'Components');
            try {
                if (_fsPlus2.default.isDirectorySync(compFolderPath)) {
                    return compFolderPath;
                } else {
                    child_process.spawnSync('mkdir', ['-p', compFolderPath]);
                    return compFolderPath;
                }
            } catch (e) {
                _gulpLogger2.default.error(e);
                return null;
            }
        }
    }, {
        key: '_readComponentMetadata',
        value: function _readComponentMetadata(componentMetadataPath, callbacks) {
            _fileSystem2.default.readFile(componentMetadataPath, callbacks);
        }
    }, {
        key: 'importComponent',
        value: function importComponent(payload, respond) {
            var _this = this;

            try {
                var _ret = function () {
                    var compPaths = _fsPlus2.default.listSync(CACHE_FOLDER);
                    //const compPaths = fs.listSync('')
                    var componentName = payload.componentName;
                    var matchingPathIdx = _lodash2.default.findIndex(compPaths, function (comp) {
                        return _path2.default.basename(comp).includes(componentName);
                    });
                    if (matchingPathIdx == -1) {
                        respond((0, _genericActions.onError)('Could not find a component with that name'));
                        return {
                            v: void 0
                        };
                    }
                    var componentPkg = compPaths[matchingPathIdx];
                    var projectRoot = payload.projectRoot;
                    if (typeof projectRoot != 'string') {
                        projectRoot = [''].concat(projectRoot).join('/');
                    }
                    var componentFolder = _this._verifyOrCreateComponentFolder(projectRoot);
                    if (!componentFolder) {
                        respond((0, _genericActions.onError)('Could not find or initialize component folder in project root'));
                        return {
                            v: void 0
                        };
                    }
                    child_process.spawnSync('tar', ['-xzf', componentPkg, '-C', componentFolder]);
                    var componentMetadataPath = _path2.default.join(componentFolder, componentName, componentName + '.js.deco');
                    var requirePath = _path2.default.join(componentFolder, componentName, componentName).split('/');
                    requirePath.shift(); //get rid of leading slash
                    _this._readComponentMetadata(componentMetadataPath, {
                        success: function success(data) {
                            var metadata = JSON.parse(data.toString());
                            respond((0, _componentActions.onImportComponent)(metadata, requirePath));
                        }, error: function error(err) {
                            _gulpLogger2.default.error(err);
                            respond((0, _genericActions.onError)('Could not get component metadata'));
                        }
                    });
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } catch (e) {
                _gulpLogger2.default.error(e);
                respond((0, _genericActions.onError)('Component failed to import'));
            }
        }

        //获取组件列表

    }, {
        key: 'getComponentList',
        value: function getComponentList(payload, respond) {
            try {
                //Logger.info('callback========'+'CACHE_FOLDER='+CACHE_FOLDER);
                var compPaths = _fsPlus2.default.listSync(CACHE_FOLDER);
                //Logger.info('CACHE_FOLDER========='+CACHE_FOLDER);
                //compPaths为空
                var componentList = _lodash2.default.map(compPaths, function (comp) {
                    var base = _path2.default.basename(comp);
                    return {
                        name: base.slice(0, base.indexOf('.tar.gz'))
                    };
                });
                //componentList为空
                respond((0, _componentActions.onComponentList)(componentList));
            } catch (e) {
                _gulpLogger2.default.error(e);
                respond((0, _genericActions.onError)('fatal error when fetching component list'));
            }
        }
    }]);

    return ComponentHandler;
}();

var handler = new ComponentHandler();
exports.default = handler;