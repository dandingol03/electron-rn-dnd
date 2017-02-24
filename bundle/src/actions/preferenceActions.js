'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sendSystemPaths = undefined;

var _ApplicationConstants = require('../../../web/src/constants/ipc/ApplicationConstants');

var _ApplicationConstants2 = _interopRequireDefault(_ApplicationConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GET_SYSTEM_PATHS = _ApplicationConstants2.default.GET_SYSTEM_PATHS; /**
                                                                         * Created by danding on 17/2/10.
                                                                         */

var sendSystemPaths = exports.sendSystemPaths = function sendSystemPaths(payload) {
    return {
        type: GET_SYSTEM_PATHS,
        payload: payload
    };
};