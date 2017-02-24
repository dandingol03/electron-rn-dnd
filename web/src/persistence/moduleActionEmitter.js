/**
 * Created by danding on 17/2/14.
 */

import {
    fetchModuleRegistry,
    DEFAULT_REGISTRY,
} from '../api/ModuleClient.js'

import {
    addModuleRegistry,
} from '../actions/moduleActions.js'

const moduleActionEmitter = (store) => {
    fetchModuleRegistry(DEFAULT_REGISTRY).then((modules) => {
        store.dispatch(addModuleRegistry(DEFAULT_REGISTRY, modules))
    })
}

export default moduleActionEmitter
