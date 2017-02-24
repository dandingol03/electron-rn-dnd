'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerHandlers = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _windowHandler = require('../handlers/windowHandler');

var _windowHandler2 = _interopRequireDefault(_windowHandler);

var _fileHandler = require('../handlers/fileHandler');

var _fileHandler2 = _interopRequireDefault(_fileHandler);

var _projectHandler = require('../handlers/projectHandler');

var _projectHandler2 = _interopRequireDefault(_projectHandler);

var _preferenceHandler = require('../handlers/preferenceHandler');

var _preferenceHandler2 = _interopRequireDefault(_preferenceHandler);

var _componentHandler = require('../handlers/componentHandler');

var _componentHandler2 = _interopRequireDefault(_componentHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by danding on 17/2/8.
 */

var handlers = [_windowHandler2.default, _fileHandler2.default, _projectHandler2.default, _preferenceHandler2.default, _componentHandler2.default];

var registerHandlers = exports.registerHandlers = function registerHandlers() {
    _lodash2.default.each(handlers, function (handler) {
        handler.register();
    });
};