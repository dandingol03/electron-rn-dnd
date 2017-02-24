/**
 * Created by danding on 17/2/9.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.openProjectSettings = exports.saveAs = exports.save = exports.newProject = exports.setProject = exports.customConfigError = undefined;

var _ProjectConstants = require('../../../web/src/constants/ipc/ProjectConstants');

var _ProjectConstants2 = _interopRequireDefault(_ProjectConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');

var CREATE_NEW_PROJECT = _ProjectConstants2.default.CREATE_NEW_PROJECT,
    SET_PROJECT_DIR = _ProjectConstants2.default.SET_PROJECT_DIR,
    SAVE_PROJECT = _ProjectConstants2.default.SAVE_PROJECT,
    SAVE_AS_PROJECT = _ProjectConstants2.default.SAVE_AS_PROJECT,
    OPEN_PROJECT_SETTINGS = _ProjectConstants2.default.OPEN_PROJECT_SETTINGS,
    CUSTOM_CONFIG_ERROR = _ProjectConstants2.default.CUSTOM_CONFIG_ERROR;


var EventTypes = {
    newProject: 'project.create-new-project'
};

var RequestTypes = {};

var customConfigError = exports.customConfigError = function customConfigError(errorMessage) {
    return {
        type: CUSTOM_CONFIG_ERROR,
        errorMessage: errorMessage
    };
};

var setProject = exports.setProject = function setProject(projectPath, isTemp) {
    return {
        type: SET_PROJECT_DIR,
        absolutePath: new Buffer(projectPath).toString('hex'),
        isTemp: isTemp
    };
};

var newProject = exports.newProject = function newProject() {
    return {
        type: CREATE_NEW_PROJECT
    };
};

var save = exports.save = function save() {
    return {
        type: SAVE_PROJECT
    };
};

var saveAs = exports.saveAs = function saveAs() {
    return {
        type: SAVE_AS_PROJECT
    };
};

var openProjectSettings = exports.openProjectSettings = function openProjectSettings(settingsPathInfo) {
    return {
        type: OPEN_PROJECT_SETTINGS,
        settingsInfo: {
            fileType: 'file',
            id: settingsPathInfo.id,
            module: settingsPathInfo.baseName,
            absolutePath: settingsPathInfo.absolutePathArray,
            isLeaf: true
        }
    };
};