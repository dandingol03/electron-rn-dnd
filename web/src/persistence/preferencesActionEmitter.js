/**
 * Created by danding on 17/2/10.
 */

import _ from 'lodash'

import LocalStorage from './LocalStorage.js'
import { setPreferences } from '../actions/preferencesActions.js'
import { ROOT_KEY, CATEGORIES, PREFERENCES, METADATA } from '../constants/PreferencesConstants.js'

const preferencesActionEmitter = (store) => {

    const mergeDefaults = (data) => {
        _.each(CATEGORIES, (categoryKey) => {
            data[categoryKey] = data[categoryKey] || {}
            _.each(PREFERENCES[categoryKey], (key) => {
                const preference = data[categoryKey][key]
                if (typeof preference === 'undefined') {
                    data[categoryKey][key] = METADATA[categoryKey][key].defaultValue
                }
            })
        })
        return data
    }

    const handlePreferencesChange = (newValue) => {
        store.dispatch(setPreferences(newValue))
    }

    // Load initial data
    const data = mergeDefaults(LocalStorage.loadObject(ROOT_KEY))
    handlePreferencesChange(data)

    // Handle changes
    LocalStorage.on(ROOT_KEY, handlePreferencesChange)

}

export default preferencesActionEmitter
