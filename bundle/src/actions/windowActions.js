/**
 * Created by danding on 17/2/8.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.openPathChooserDialog = exports.saveAsDialog = exports.openProjectDialog = undefined;

var _WindowConstants = require('../../../web/src/constants/ipc/WindowConstants');

var _WindowConstants2 = _interopRequireDefault(_WindowConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPEN_PROJECT_DIALOG = _WindowConstants2.default.OPEN_PROJECT_DIALOG,
    SAVE_AS_DIALOG = _WindowConstants2.default.SAVE_AS_DIALOG,
    OPEN_PATH_CHOOSER_DIALOG = _WindowConstants2.default.OPEN_PATH_CHOOSER_DIALOG;
var openProjectDialog = exports.openProjectDialog = function openProjectDialog(path) {
    return {
        type: OPEN_PROJECT_DIALOG,
        path: path
    };
};

var saveAsDialog = exports.saveAsDialog = function saveAsDialog(path) {
    return {
        type: SAVE_AS_DIALOG,
        path: path
    };
};

var openPathChooserDialog = exports.openPathChooserDialog = function openPathChooserDialog(path) {
    return {
        type: OPEN_PATH_CHOOSER_DIALOG,
        path: path
    };
};