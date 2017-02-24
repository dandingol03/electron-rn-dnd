/**
 * Created by danding on 17/2/18.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onImportComponent = exports.onComponentList = undefined;

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

var _ComponentConstants = require('../../../web/src/constants/ipc/ComponentConstants');

var _ComponentConstants2 = _interopRequireDefault(_ComponentConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GET_COMPONENT_LIST = _ComponentConstants2.default.GET_COMPONENT_LIST,
    IMPORT_COMPONENT = _ComponentConstants2.default.IMPORT_COMPONENT;
var onComponentList = exports.onComponentList = function onComponentList(componentList) {
    return {
        type: GET_COMPONENT_LIST,
        componentList: componentList
    };
};

var onImportComponent = exports.onImportComponent = function onImportComponent(metadata, requirePath) {
    return {
        type: IMPORT_COMPONENT,
        metadata: metadata,
        requirePath: requirePath
    };
};