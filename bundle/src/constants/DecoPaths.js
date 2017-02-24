/**
 * Created by danding on 17/2/9.
 */

'use strict';

var path = require('path');

var FileSystem = require('../fs/fileSystem.js');
var Logger = require('../logger/gulpLogger');

var ROOT_FOLDER = '/com.decosoftware.Deco';
var PROJECT_ROOT_FOLDER = '/com.decosoftware.Deco/ProjectInfo';
var LIB_FOLDER = '/com.decosoftware.Deco/libs';
var BINARIES_FOLDER = '/com.decosoftware.Deco/libs/binaries';
var COMPONENT_CACHE_FOLDER = '/com.decosoftware.Deco/cache';
var TEMP_PROJECT_FOLDER = '/.Deco/tmp/Project';
var TEMP_PROJECT_FOLDER_TEMPLATE = '/.Deco/tmp/.template.Project';
var LIB_PROJECT_FOLDER = '/com.decosoftware.Deco/libs/Project';

var PUBLIC_FOLDER = null;

if (global.__DEV__) {
    PUBLIC_FOLDER = path.join(__dirname, '../../public');
} else {
    PUBLIC_FOLDER = path.join(__dirname, '../public');
}

module.exports = {
    RelativePaths: {
        ROOT_FOLDER: ROOT_FOLDER,
        PROJECT_ROOT_FOLDER: PROJECT_ROOT_FOLDER,
        LIB_FOLDER: LIB_FOLDER,
        BINARIES_FOLDER: BINARIES_FOLDER,
        COMPONENT_CACHE_FOLDER: COMPONENT_CACHE_FOLDER
    },
    PUBLIC_FOLDER: PUBLIC_FOLDER,
    APP_SUPPORT: FileSystem.getAppPath(ROOT_FOLDER),
    LIB_FOLDER: FileSystem.getAppPath(LIB_FOLDER),
    BINARIES_FOLDER: FileSystem.getAppPath(BINARIES_FOLDER),
    TMP_FOLDER: FileSystem.getTmpPath(ROOT_FOLDER),
    CACHE_FOLDER: FileSystem.getAppPath(COMPONENT_CACHE_FOLDER),
    TEMP_PROJECT_FOLDER: FileSystem.getHomePath(TEMP_PROJECT_FOLDER),
    LIB_PROJECT_FOLDER: FileSystem.getAppPath(LIB_PROJECT_FOLDER),
    TEMP_PROJECT_FOLDER_TEMPLATE: FileSystem.getHomePath(TEMP_PROJECT_FOLDER_TEMPLATE)
};