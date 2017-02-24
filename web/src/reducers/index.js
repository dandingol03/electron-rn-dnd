/**
 * Created by danding on 17/2/5.
 */
/**
 * Created by json on 16/5/25.
 * 根reducer
 */
import { routeReducer, } from 'react-router-redux'
import { combineReducers } from 'redux';

import user from './user.js';
import timer from './timer.js';
import uiReducer from './uiReducer.js';
import fileReducer from './fileReducer.js'
import applicationReducer from './applicationReducer.js'
import preferencesReducer from './preferencesReducer.js';
import modules from './moduleReducer.js'
import metadataReducer from './metadata/metadataReducer.js'
import editorReducer from './editorReducer.js'
import historyReducer from './historyReducer.js'

var rootReducer=combineReducers({
    user,
    timer,
    ui:uiReducer,
    routing: routeReducer,
    directory: fileReducer,
    application: applicationReducer,
    preferences: preferencesReducer,
    metadata: metadataReducer,
    modules,
    editor: editorReducer,
    history: historyReducer,
});

module.exports=rootReducer;
