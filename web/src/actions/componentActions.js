/**
 * Created by danding on 17/2/11.
 */


import request from '../ipc/Request.js'

import ComponentConstants from '../constants/ipc/ComponentConstants.js'
const {
    IMPORT_COMPONENT,
    GET_COMPONENT_LIST,
} = ComponentConstants

export const ON_COMPONENT_LIST = 'ON_COMPONENT_LIST'
export const _onComponentList = (list) => {
    return {
        type: ON_COMPONENT_LIST,
        list: list,
    }
}

export const LOAD_COMPONENT_METADATA = 'LOAD_COMPONENT_METADATA'
export const loadComponent = (componentInfo, metadata) => {
    return {
        type: LOAD_COMPONENT_METADATA,
        name: componentInfo.name,
        module: componentInfo.module,
        metadata,
    }
}

function _importComponent(projectRoot, componentName) {
    return {
        type: IMPORT_COMPONENT,
        projectRoot,
        componentName,
    }
}
export function importComponent(componentInfo) {
    return (dispatch, getState) => {
        const state = getState()

        for(var field in componentInfo)
            console.log(field);
        //查看是否拖拽的组件已位于metadata的reducer中
        if (state.metadata.components.localComponents[componentInfo.name]) {
            return Promise.resolve()
        }

        if (componentInfo.module) {
            return Promise.resolve()
        }
        //否则向ipcMain发出引入请求
        return request(_importComponent(state.directory.rootPath, componentInfo.name))
    }
}

function _getComponentList() {
    return {
        type: GET_COMPONENT_LIST,
    }
}
export function getComponentList() {
    return (dispatch, getState) => {
        request(_getComponentList()).then((resp) => {
            dispatch(_onComponentList(resp.componentList))
        })
    }
}
