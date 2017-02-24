/**
 * Created by danding on 17/2/10.
 */


import path from 'path'
import _ from 'lodash'

 import bridge from '../bridge'
 import {
     sendSystemPaths,
 } from '../actions/preferenceActions'

 import ApplicationConstants from '../../../web/src/constants/ipc/ApplicationConstants'
 const {
     BROADCAST_PREFERENCES,
     GET_SYSTEM_PATHS,
 } = ApplicationConstants

 import {PREFERENCES,  CATEGORIES } from '../../../web/src/constants/PreferencesConstants';





import {
    onSuccess,
    onError,
} from '../actions/genericActions'

import Logger from '../logger/gulpLogger'

class PreferenceHandler {
    constructor() {
        this._preferences = {}
        this._callbacks = []
    }

    register() {
        bridge.on(BROADCAST_PREFERENCES, this.storePreferences.bind(this))
        bridge.on(GET_SYSTEM_PATHS, this.getSystemPaths.bind(this))
    }

    onPreferenceUpdate(cb) {
        this._callbacks.push(cb)
    }

    _defaultPreferences() {
        return {
            [CATEGORIES.GENERAL]: {
                [PREFERENCES[CATEGORIES.GENERAL].ANDROID_HOME]: path.join(`/Users/${process.env['USER']}`, '/Library/Android/sdk'),
                [PREFERENCES[CATEGORIES.GENERAL].GENYMOTION_APP]: path.join('/Applications', 'Genymotion.app'),
            },
        }
    }

    getPreferences() {
        if (!this._preferences[CATEGORIES.GENERAL]) {
            this._preferences = this._defaultPreferences()
        }

        return this._preferences
    }

    getSystemPaths(payload, respond) {
        respond(sendSystemPaths(this._defaultPreferences()))
    }

    storePreferences(payload, respond) {
        if (payload.preferences) {
            this._preferences = payload.preferences
        }

        _.each(this._callbacks, (cb) => {
            cb()
        })
        respond(onSuccess(BROADCAST_PREFERENCES))
    }
}

const handler = new PreferenceHandler()
export default handler
