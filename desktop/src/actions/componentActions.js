/**
 * Created by danding on 17/2/18.
 */

'use strict'

import Logger from '../logger/gulpLogger'
import ComponentConstants from '../../../web/src/constants/ipc/ComponentConstants'
const {
    GET_COMPONENT_LIST,
    IMPORT_COMPONENT,
} = ComponentConstants


export const onComponentList = (componentList) => {
    return {
        type: GET_COMPONENT_LIST,
        componentList
    }
}

export const onImportComponent = (metadata, requirePath) => {
    return {
        type: IMPORT_COMPONENT,
        metadata,
        requirePath,
    }
}
