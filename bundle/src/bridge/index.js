/**
 * Created by danding on 17/2/5.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _requestEmitter = require('./requestEmitter');

var _requestEmitter2 = _interopRequireDefault(_requestEmitter);

var _ApplicationConstants = require('../../../web/src/constants/ipc/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _FileConstants = require('../../../web/src/constants/ipc/FileConstants');

var _FileConstants2 = _interopRequireDefault(_FileConstants);

var _ComponentConstants = require('../../../web/src/constants/ipc/ComponentConstants');

var _ComponentConstants2 = _interopRequireDefault(_ComponentConstants);

var _ProcessConstants = require('../../../web/src/constants/ipc/ProcessConstants');

var _ProcessConstants2 = _interopRequireDefault(_ProcessConstants);

var _ProjectConstants = require('../../../web/src/constants/ipc/ProjectConstants');

var _ProjectConstants2 = _interopRequireDefault(_ProjectConstants);

var _WindowConstants = require('../../../web/src/constants/ipc/WindowConstants');

var _WindowConstants2 = _interopRequireDefault(_WindowConstants);

var _ModuleConstants = require('../../../web/src/constants/ipc/ModuleConstants');

var _ModuleConstants2 = _interopRequireDefault(_ModuleConstants);

var _ErrorConstants = require('../../../web/src/constants/ipc/ErrorConstants');

var _ErrorConstants2 = _interopRequireDefault(_ErrorConstants);

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ERROR = _ErrorConstants2.default.ERROR;


var REQUEST_TYPES = [_ApplicationConstants2.default, _FileConstants2.default, _ComponentConstants2.default, _ProcessConstants2.default, _ProjectConstants2.default, _WindowConstants2.default, _ModuleConstants2.default];

function sendToRenderer(channel, payload, windowId) {
    if (!channel) {
        _gulpLogger2.default.error('Channel was found broken', channel);
        return;
    }
    //for the moment, we assume only one instance of the app is running
    if (!payload) {
        payload = {}; // not sure if this will cause problems when undefined or null
    }

    _gulpLogger2.default.info('preferences=' + windowId);
    if (windowId == 'preferences') {
        try {
            if (!global.preferencesWindow) return;
            global.preferencesWindow.webContents.send(channel, payload);
        } catch (e) {
            //the preferences window may not be open...
            _gulpLogger2.default.info('Warning: ', e);
        }
    } else {
        //TODO:locate all openWindows
        _gulpLogger2.default.info('openWindows= ' + global.openWindows);
        for (var id in global.openWindows) {
            global.openWindows[id].webContents.send(channel, payload);
        }
    }
}

var Bridge = function (_EventEmitter) {
    _inherits(Bridge, _EventEmitter);

    function Bridge() {
        _classCallCheck(this, Bridge);

        var _this = _possibleConstructorReturn(this, (Bridge.__proto__ || Object.getPrototypeOf(Bridge)).call(this));

        _this._init();
        _this._send = sendToRenderer;
        return _this;
    }

    _createClass(Bridge, [{
        key: '_init',
        value: function _init() {
            var _this2 = this;

            _lodash2.default.each(REQUEST_TYPES, function (requestTypes) {
                _lodash2.default.each(requestTypes, function (id, requestType) {
                    _requestEmitter2.default.on(id, function (body, callback, evt) {
                        _this2.emit(id, body, function (resp) {
                            if (resp && resp.type != ERROR) {
                                callback(null, resp);
                                return;
                            }
                            callback(resp);
                        }, evt);
                    });
                });
            });
        }

        //TODO:this function un-clear

    }, {
        key: 'send',
        value: function send(payload, windowId) {
            _gulpLogger2.default.info('bridge send , type=' + payload.type);
            this._send(payload.type, payload, windowId);
        }
    }]);

    return Bridge;
}(_events.EventEmitter);

var bridge = new Bridge();

exports.default = bridge;