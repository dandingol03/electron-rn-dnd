/**
 * Created by danding on 17/2/5.
 */

'use strict'
const ipc = require('electron').ipcMain

import {
    ipcMain,
} from 'electron'
import { EventEmitter, } from 'events'

import Logger from '../logger/gulpLogger'

class RequestEmitter extends EventEmitter {
    emit(channel, messageId, body, evt) {
        const callback = (err, data) => {
            try {
                evt.sender.send('response', messageId, err, data)
            } catch (e) {
                Logger.error(e)
            }
        }
        super.emit(channel, body, callback, evt)
    }
}

const emitter = new RequestEmitter()

ipcMain.on('request', (evt, messageId, channel, body) => {
    emitter.emit(channel, messageId, body, evt)
})

module.exports = emitter
