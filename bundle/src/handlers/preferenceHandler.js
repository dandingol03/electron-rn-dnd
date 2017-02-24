'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by danding on 17/2/10.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bridge = require('../bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _preferenceActions = require('../actions/preferenceActions');

var _ApplicationConstants = require('../../../web/src/constants/ipc/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

var _PreferencesConstants = require('../../../web/src/constants/PreferencesConstants');

var _genericActions = require('../actions/genericActions');

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BROADCAST_PREFERENCES = _ApplicationConstants2.default.BROADCAST_PREFERENCES,
    GET_SYSTEM_PATHS = _ApplicationConstants2.default.GET_SYSTEM_PATHS;

var PreferenceHandler = function () {
    function PreferenceHandler() {
        _classCallCheck(this, PreferenceHandler);

        this._preferences = {};
        this._callbacks = [];
    }

    _createClass(PreferenceHandler, [{
        key: 'register',
        value: function register() {
            _bridge2.default.on(BROADCAST_PREFERENCES, this.storePreferences.bind(this));
            _bridge2.default.on(GET_SYSTEM_PATHS, this.getSystemPaths.bind(this));
        }
    }, {
        key: 'onPreferenceUpdate',
        value: function onPreferenceUpdate(cb) {
            this._callbacks.push(cb);
        }
    }, {
        key: '_defaultPreferences',
        value: function _defaultPreferences() {
            var _CATEGORIES$GENERAL;

            return _defineProperty({}, _PreferencesConstants.CATEGORIES.GENERAL, (_CATEGORIES$GENERAL = {}, _defineProperty(_CATEGORIES$GENERAL, _PreferencesConstants.PREFERENCES[_PreferencesConstants.CATEGORIES.GENERAL].ANDROID_HOME, _path2.default.join('/Users/' + process.env['USER'], '/Library/Android/sdk')), _defineProperty(_CATEGORIES$GENERAL, _PreferencesConstants.PREFERENCES[_PreferencesConstants.CATEGORIES.GENERAL].GENYMOTION_APP, _path2.default.join('/Applications', 'Genymotion.app')), _CATEGORIES$GENERAL));
        }
    }, {
        key: 'getPreferences',
        value: function getPreferences() {
            if (!this._preferences[_PreferencesConstants.CATEGORIES.GENERAL]) {
                this._preferences = this._defaultPreferences();
            }

            return this._preferences;
        }
    }, {
        key: 'getSystemPaths',
        value: function getSystemPaths(payload, respond) {
            respond((0, _preferenceActions.sendSystemPaths)(this._defaultPreferences()));
        }
    }, {
        key: 'storePreferences',
        value: function storePreferences(payload, respond) {
            if (payload.preferences) {
                this._preferences = payload.preferences;
            }

            _lodash2.default.each(this._callbacks, function (cb) {
                cb();
            });
            respond((0, _genericActions.onSuccess)(BROADCAST_PREFERENCES));
        }
    }]);

    return PreferenceHandler;
}();

var handler = new PreferenceHandler();
exports.default = handler;