'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by danding on 17/2/14.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _once = require('once');

var _once2 = _interopRequireDefault(_once);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var npm = function () {
    function npm() {
        _classCallCheck(this, npm);
    }

    _createClass(npm, null, [{
        key: 'run',
        value: function run() {
            var cmd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var cb = arguments[2];
            var progress = arguments[3];

            cb = (0, _once2.default)(cb);

            var execPath = _path2.default.join(__dirname, '../node_modules/npm/bin/npm-cli.js');

            var child = (0, _child_process.fork)(execPath, cmd, opts);

            child.on('error', cb);

            child.on('close', function (code) {
                cb(null, code);
            });

            if (progress) {
                child.on('message', function (response) {
                    if (response) {
                        progress(response.progress);
                    }
                });
            }

            return child;
        }
    }]);

    return npm;
}();

exports.default = npm;