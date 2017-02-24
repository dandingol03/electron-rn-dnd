'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QUESTION = exports.INFO = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by danding on 17/2/10.
 */

var DecoIcon = _electron.nativeImage.createFromPath(_path2.default.join(__dirname, '../../public/images/logo.png'));

var INFO = exports.INFO = {
    noUpdateIsAvailable: {
        type: 'info',
        message: 'No update is available',
        detail: 'You are using the latest version of Deco',
        buttons: ['Ok'],
        icon: DecoIcon
    }
};

var QUESTION = exports.QUESTION = {
    shouldRestartAndUpdate: {
        type: 'question',
        message: 'A new version of Deco is available!',
        detail: 'Update and restart Deco? Any unsaved changes will be lost.',
        buttons: ['Update and Restart', 'Later'],
        icon: DecoIcon
    },
    shouldLoseTemporaryDirectory: {
        type: 'question',
        message: 'Quit without saving?',
        detail: 'This project has not yet been saved. ' + 'New projects are temporary until saved for the first time. ' + 'To save this project, first click Cancel, then go to File > Save Project.',
        buttons: ['Quit', 'Cancel'],
        icon: DecoIcon
    },
    shouldLoseUnsavedProgress: {
        type: 'question',
        message: 'Quit without saving?',
        detail: 'Files have been changed since last save. Quit anyway?',
        buttons: ['Quit', 'Cancel'],
        icon: DecoIcon
    }
};