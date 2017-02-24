'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onSuccess = exports.onError = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ErrorConstants = require('../../../web/src/constants/ipc/ErrorConstants');

var _ErrorConstants2 = _interopRequireDefault(_ErrorConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by danding on 17/2/6.
 */

var Logger = require('../logger/gulpLogger');

var ERROR = _ErrorConstants2.default.ERROR;
var onError = exports.onError = function onError(error) {
    if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) != 'object') {
        error = {
            message: error
        };
    }
    return Object.assign({}, error, {
        type: ERROR
    });
};

var onSuccess = exports.onSuccess = function onSuccess(type) {
    return {
        type: type
    };
};