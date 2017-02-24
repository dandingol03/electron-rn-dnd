'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by danding on 17/2/10.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

var _electron = require('electron');

var _DecoPaths = require('../constants/DecoPaths');

var _bridge = require('../bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _uiActions = require('../../../web/src/actions/uiActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UPGRADE_FILE = global.__DEV__ ? _path2.default.join(__dirname, '../Scripts/postinstall') : _path2.default.join(__dirname, '../../app.asar.unpacked/Scripts/postinstall');
var DECO_SUDO = _path2.default.join(_DecoPaths.APP_SUPPORT, '/libs/binaries/Deco');
var VERSION_FILE_PATH = _path2.default.join(_DecoPaths.APP_SUPPORT, '.deco.version');

var UpgradeHandler = function () {
    function UpgradeHandler() {
        _classCallCheck(this, UpgradeHandler);
    }

    _createClass(UpgradeHandler, [{
        key: 'needsUpgrade',
        value: function needsUpgrade() {
            try {
                var lastVersion = _fs2.default.readFileSync(VERSION_FILE_PATH).toString();
                return lastVersion != _electron.app.getVersion();
            } catch (e) {
                //this behavior is mostly expected, but we'll keep it in local logs for debugging
                _gulpLogger2.default.info('err=' + e);
                return true;
            }
        }
    }, {
        key: '_upgrade',
        value: function _upgrade(resolve, reject) {
            var opts = global.__DEV__ ? 'dev ' + _path2.default.join(__dirname, '../deco_unpack_lib') : 'upgrade';
            var command = '"' + UPGRADE_FILE + '" ' + opts;
            var execString = 'do shell script \\"' + command + '\\" with administrator privileges';
            _child_process2.default.exec('"' + DECO_SUDO + '" -e "' + execString + '"', { env: process.env }, function (err, stdout, stderr) {
                if (err !== null) {
                    _gulpLogger2.default.error('upgrade stderr: ' + stderr);
                    _gulpLogger2.default.error('upgrade error: ' + err);
                    _bridge2.default.send((0, _uiActions.upgradeStatus)('failed'));
                    reject();
                    return;
                }
                try {
                    _bridge2.default.send((0, _uiActions.upgradeStatus)('success'));
                    resolve();
                } catch (e) {
                    _gulpLogger2.default.error(e);
                    _bridge2.default.send((0, _uiActions.upgradeStatus)('failed'));
                    reject();
                }
            });
        }
    }, {
        key: 'upgrade',
        value: function upgrade() {
            return new Promise(this._upgrade.bind(this));
        }
    }]);

    return UpgradeHandler;
}();

var handler = new UpgradeHandler();
exports.default = handler;