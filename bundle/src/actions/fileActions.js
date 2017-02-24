/**
 * Created by danding on 17/2/6.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeSubPathBatch = exports.removeSubPath = exports.addSubPathBatch = exports.addSubPath = exports.onFileMetadata = exports.onFileData = exports.onRename = exports.onFileCreated = exports.onExternalFileData = exports.confirmSave = undefined;

var _gulpLogger = require('../logger/gulpLogger');

var _gulpLogger2 = _interopRequireDefault(_gulpLogger);

var _FileConstants = require('../../../web/src/constants/ipc/FileConstants');

var _FileConstants2 = _interopRequireDefault(_FileConstants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SAVE_SUCCESSFUL = _FileConstants2.default.SAVE_SUCCESSFUL,
    ON_FILE_DATA = _FileConstants2.default.ON_FILE_DATA,
    GET_FILE_DATA = _FileConstants2.default.GET_FILE_DATA,
    GET_FILE_METADATA = _FileConstants2.default.GET_FILE_METADATA,
    RENAME = _FileConstants2.default.RENAME,
    CREATE_DIRECTORY = _FileConstants2.default.CREATE_DIRECTORY,
    CREATE_FILE = _FileConstants2.default.CREATE_FILE,
    ADD_SUB_PATH = _FileConstants2.default.ADD_SUB_PATH,
    ADD_SUB_PATH_BATCH = _FileConstants2.default.ADD_SUB_PATH_BATCH,
    REMOVE_SUB_PATH = _FileConstants2.default.REMOVE_SUB_PATH,
    REMOVE_SUB_PATH_BATCH = _FileConstants2.default.REMOVE_SUB_PATH_BATCH;
var confirmSave = exports.confirmSave = function confirmSave(id) {
    return {
        type: SAVE_SUCCESSFUL,
        id: id
    };
};

var onExternalFileData = exports.onExternalFileData = function onExternalFileData(pathObj, utf8Data) {
    return {
        type: ON_FILE_DATA,
        id: pathObj.id,
        absolutePathArray: pathObj.absolutePathArray,
        utf8Data: utf8Data
    };
};

var onFileCreated = exports.onFileCreated = function onFileCreated(pathObj, utf8Data) {
    return {
        type: CREATE_FILE,
        id: pathObj.id,
        absolutePathArray: pathObj.absolutePathArray,
        fileType: 'file',
        baseName: pathObj.baseName
    };
};

var onRename = exports.onRename = function onRename(pathObj) {
    return {
        type: RENAME,
        id: pathObj.id,
        baseName: pathObj.baseName,
        absolutePathArray: pathObj.absolutePathArray
    };
};

var onFileData = exports.onFileData = function onFileData(pathObj, utf8Data) {
    return {
        type: GET_FILE_DATA,
        id: pathObj.id,
        absolutePathArray: pathObj.absolutePathArray,
        utf8Data: utf8Data
    };
};

var onFileMetadata = exports.onFileMetadata = function onFileMetadata(pathObj, utf8Data) {
    return {
        type: GET_FILE_METADATA,
        id: pathObj.id,
        absolutePathArray: pathObj.absolutePathArray,
        utf8Data: utf8Data
    };
};

var addSubPath = exports.addSubPath = function addSubPath(pathObj, fileType) {
    return {
        type: ADD_SUB_PATH,
        fileType: fileType,
        baseName: pathObj.baseName,
        absolutePathArray: pathObj.absolutePathArray,
        id: pathObj.id
    };
};

var addSubPathBatch = exports.addSubPathBatch = function addSubPathBatch(queue) {
    return {
        type: ADD_SUB_PATH_BATCH,
        batch: queue
    };
};

var removeSubPath = exports.removeSubPath = function removeSubPath(pathObj) {
    return {
        type: REMOVE_SUB_PATH,
        baseName: pathObj.baseName,
        absolutePathArray: pathObj.absolutePathArray,
        id: pathObj.id
    };
};

var removeSubPathBatch = exports.removeSubPathBatch = function removeSubPathBatch(queue) {
    return {
        type: REMOVE_SUB_PATH_BATCH,
        batch: queue
    };
};