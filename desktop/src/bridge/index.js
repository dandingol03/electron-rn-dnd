/**
 * Created by danding on 17/2/5.
 */


'use strict'

import _ from 'lodash'
import { EventEmitter, } from 'events'
import requestEmitter from './requestEmitter'

import ApplicationConstants from '../../../web/src/constants/ipc/ApplicationConstants'
import FileConstants from '../../../web/src/constants/ipc/FileConstants'
import ComponentConstants from '../../../web/src/constants/ipc/ComponentConstants'
import ProcessConstants from '../../../web/src/constants/ipc/ProcessConstants'
import ProjectConstants from '../../../web/src/constants/ipc/ProjectConstants'
import WindowConstants from '../../../web/src/constants/ipc/WindowConstants'
import ModuleConstants from '../../../web/src/constants/ipc/ModuleConstants'

import ErrorConstants from '../../../web/src/constants/ipc/ErrorConstants'
const {
    ERROR,
} = ErrorConstants


import Logger from '../logger/gulpLogger'

const REQUEST_TYPES = [
    ApplicationConstants,
    FileConstants,
    ComponentConstants,
    ProcessConstants,
    ProjectConstants,
    WindowConstants,
    ModuleConstants,
]

function sendToRenderer(channel, payload, windowId) {
    if (!channel) {
        Logger.error('Channel was found broken', channel)
        return
    }
    //for the moment, we assume only one instance of the app is running
    if (!payload) {
        payload = {} // not sure if this will cause problems when undefined or null
    }

    Logger.info('preferences='+windowId);
    if (windowId == 'preferences') {
        try {
            if (!global.preferencesWindow) return
            global.preferencesWindow.webContents.send(channel, payload)
        } catch (e) {
            //the preferences window may not be open...
            Logger.info('Warning: ', e)
        }
    } else {
        //TODO:locate all openWindows
        Logger.info('openWindows= '+global.openWindows);
        for (var id in global.openWindows) {
            global.openWindows[id].webContents.send(channel, payload)
        }
    }

}

class Bridge extends EventEmitter {

    constructor() {
        super()
        this._init()
        this._send = sendToRenderer
    }

    _init() {
        _.each(REQUEST_TYPES, (requestTypes) => {
            _.each(requestTypes, (id, requestType) => {
                requestEmitter.on(id, (body, callback, evt) => {
                    this.emit(id, body, (resp) => {
                        if (resp && resp.type != ERROR) {
                            callback(null, resp)
                            return
                        }
                        callback(resp)
                    }, evt)
                })
            })
        })
    }

    //TODO:this function un-clear
    send(payload, windowId) {
        Logger.info('bridge send , type='+payload.type);
        this._send(payload.type, payload, windowId)
    }

}

const bridge = new Bridge()

export default bridge
