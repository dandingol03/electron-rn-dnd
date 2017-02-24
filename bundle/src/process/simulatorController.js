/**
 * Created by danding on 17/2/9.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _taskLauncher = require('./taskLauncher');

var _taskLauncher2 = _interopRequireDefault(_taskLauncher);

var _bridge = require('../bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _processActions = require('../actions/processActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var child_process = require('child_process');
var path = require('path');

var Logger = require('../logger/gulpLogger');
var LIB_FOLDER = require('../fs/model').LIB_FOLDER;
var APP_WATCHER_FILE = path.join(LIB_FOLDER, '/Scripts/appWatcher.js');
var SimulatorUtils = require('./utils/simulatorUtils');

var SimulatorController = function () {
    function SimulatorController() {
        _classCallCheck(this, SimulatorController);

        this._lastUsedArgs = null;
        this._androidRunning = false;
        this._iosRunning = false;
    }

    _createClass(SimulatorController, [{
        key: 'clearLastSimulator',
        value: function clearLastSimulator() {
            this._lastUsedArgs = null;
        }
    }, {
        key: 'lastUsedArgs',
        value: function lastUsedArgs() {
            return this._lastUsedArgs;
        }
    }, {
        key: 'isSimulatorRunning',
        value: function isSimulatorRunning() {
            return this._androidRunning || this._iosRunning;
        }
    }, {
        key: 'runSimulator',
        value: function runSimulator(args) {
            if (!args) {
                args = {};
                if (this._lastUsedArgs) {
                    args = this._lastUsedArgs;
                }
            }
            this._lastUsedArgs = args;
            this._runSimulator(args);
        }
    }, {
        key: 'hardReload',
        value: function hardReload() {
            if (this.androidRunning) {
                _taskLauncher2.default.runTask('reload-android-app');
            }
            if (this.iosRunning) {
                _taskLauncher2.default.runTask('reload-ios-app');
            }
        }
    }, {
        key: '_runIOS',
        value: function _runIOS(args) {
            return _taskLauncher2.default.runTask('sim-ios', args);
        }
    }, {
        key: '_runAndroid',
        value: function _runAndroid(args) {
            return _taskLauncher2.default.runTask('sim-android', args);
        }
    }, {
        key: '_runSimulator',
        value: function _runSimulator(_args) {
            try {
                var args = _taskLauncher2.default.objToArgString(_args.simInfo);
                var child = _args.platform == 'ios' ? this._runIOS(args) : this._runAndroid(args);
                if (!child) {
                    return;
                }

                child.stdout.on('data', function (data) {
                    try {
                        var plainTextData = data.toString();
                        Logger.info(plainTextData);
                        _bridge2.default.send((0, _processActions.onPackagerOutput)(plainTextData));
                    } catch (e) {
                        Logger.error(e);
                    }
                });

                child.stderr.on('data', function (data) {
                    try {
                        var plainTextData = data.toString();
                        Logger.error('packager stderr', plainTextData);
                        // TODO
                        // not going to distinguish between stderr and stdout for now
                        _bridge2.default.send((0, _processActions.onPackagerError)(plainTextData));
                    } catch (e) {
                        Logger.error(e);
                    }
                });
            } catch (e) {
                Logger.error(e);
            }
        }
    }, {
        key: 'listAvailableSimulators',
        value: function listAvailableSimulators() {
            var platform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ios';

            return new Promise(function (resolve, reject) {
                var timeout = setTimeout(function () {
                    try {
                        resolve({
                            error: true,
                            payload: ['The task to find simulators took too long.', 'Try hitting the simulator button again or restarting Deco.']
                        });
                    } catch (e) {
                        Logger.error(e);
                        reject(e);
                    }
                }, 30000);

                var cb = function cb(obj) {
                    clearTimeout(timeout);
                    resolve(obj);
                };

                switch (platform) {
                    case 'ios':
                        _taskLauncher2.default.runManagedTask('list-ios-sim', [], null, cb);
                        break;
                    case 'android':
                        _taskLauncher2.default.runManagedTask('list-android-sim', [], null, cb);
                        break;
                    default:
                        break;
                }
            });
        }
    }, {
        key: 'androidRunning',
        get: function get() {
            return this._androidRunning;
        },
        set: function set(status) {
            this._androidRunning = status;
        }
    }, {
        key: 'iosRunning',
        get: function get() {
            return this._iosRunning;
        },
        set: function set(status) {
            this._iosRunning = status;
        }
    }, {
        key: 'simulatorStatus',
        get: function get() {
            return this.isSimulatorRunning();
        }
    }]);

    return SimulatorController;
}();

module.exports = new SimulatorController();