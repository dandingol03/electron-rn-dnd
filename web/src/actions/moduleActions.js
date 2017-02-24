/**
 * Created by danding on 17/2/11.
 */

import _ from 'lodash'

import request from '../ipc/Request.js'
import {
    SCAN_PROJECT_FOR_REGISTRIES,
} from '../constants/ipc/ModuleConstants.js'

export const ADD_MODULE_REGISTRY = 'ADD_MODULE_REGISTRY'
export const addModuleRegistry = (registry, modules) => {
    return {
        type: ADD_MODULE_REGISTRY,
        payload: {
            registry,
            modules,
        }
    }
}

const _scanLocalRegistries = (path) => {
    return {
        type: SCAN_PROJECT_FOR_REGISTRIES,
        path,
    }
}

export const scanLocalRegistries = (path) => (dispatch) => {
    return request(_scanLocalRegistries(path)).then(({payload}) => {
        _.each(payload, (modules, registry) => {
            dispatch(addModuleRegistry(registry, modules))
        })
    })
}