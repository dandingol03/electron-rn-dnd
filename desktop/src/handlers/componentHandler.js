/**
 * Created by danding on 17/2/18.
 */


'use strict'

import path from 'path'
var  child_process = require('child_process');

import _ from 'lodash'
import fs from 'fs-plus'

import FileSystem from '../fs/fileSystem'
import bridge from '../bridge'
import ComponentConstants from '../../../web/src/constants/ipc/ComponentConstants'
const {
    IMPORT_COMPONENT,
    GET_COMPONENT_LIST,
} = ComponentConstants
import ErrorConstants from '../../../web/src/constants/ipc/ErrorConstants'
const { ERROR, } = ErrorConstants

import {
    onError
} from '../actions/genericActions'

import {
    onComponentList,
    onImportComponent,
} from '../actions/componentActions'

import Logger from '../logger/gulpLogger'

const CACHE_FOLDER = require('../constants/DecoPaths').CACHE_FOLDER

class ComponentHandler {
    register() {
        bridge.on(IMPORT_COMPONENT, this.getComponentList.bind(this))
        bridge.on(GET_COMPONENT_LIST, this.getComponentList.bind(this))
    }

    _verifyOrCreateComponentFolder(rootPath) {
        const compFolderPath = path.join(rootPath, 'Components')
        try {
            if (fs.isDirectorySync(compFolderPath)) {
                return compFolderPath
            } else {
                child_process.spawnSync('mkdir', ['-p', compFolderPath])
                return compFolderPath
            }
        } catch (e) {
            Logger.error(e)
            return null
        }
    }

    _readComponentMetadata(componentMetadataPath, callbacks) {
        FileSystem.readFile(componentMetadataPath, callbacks)
    }

    importComponent(payload, respond) {
        try {
            const compPaths = fs.listSync(CACHE_FOLDER)
            //const compPaths = fs.listSync('')
            const componentName = payload.componentName
            const matchingPathIdx = _.findIndex(compPaths, (comp) => {
                return path.basename(comp).includes(componentName)
            })
            if (matchingPathIdx == -1) {
                respond(onError('Could not find a component with that name'))
                return
            }
            const componentPkg = compPaths[matchingPathIdx]
            let projectRoot = payload.projectRoot
            if (typeof projectRoot != 'string') {
                projectRoot = [''].concat(projectRoot).join('/')
            }
            const componentFolder = this._verifyOrCreateComponentFolder(projectRoot)
            if (!componentFolder) {
                respond(onError('Could not find or initialize component folder in project root'))
                return
            }
            child_process.spawnSync('tar', ['-xzf', componentPkg, '-C', componentFolder])
            const componentMetadataPath = path.join(componentFolder, componentName, componentName + '.js.deco')
            const requirePath = path.join(componentFolder, componentName, componentName).split('/')
            requirePath.shift() //get rid of leading slash
            this._readComponentMetadata(componentMetadataPath, {
                success: (data) => {
                    const metadata = JSON.parse(data.toString())
                    respond(onImportComponent(metadata, requirePath))
                }, error: (err) => {
                    Logger.error(err)
                    respond(onError('Could not get component metadata'))
                }
            })
        } catch (e) {
            Logger.error(e)
            respond(onError('Component failed to import'))
        }
    }

    //获取组件列表
    getComponentList(payload, respond) {
        try {
            //Logger.info('callback========'+'CACHE_FOLDER='+CACHE_FOLDER);
            const compPaths = fs.listSync(CACHE_FOLDER)
            //Logger.info('CACHE_FOLDER========='+CACHE_FOLDER);
            //compPaths为空
            const componentList = _.map(compPaths, (comp) => {
                const base = path.basename(comp)
                return {
                    name: base.slice(0, base.indexOf('.tar.gz'))
                }
            })
            //componentList为空
            respond(onComponentList(componentList))
        } catch (e) {
            Logger.error(e)
            respond(onError('fatal error when fetching component list'))
        }
    }

}

const handler = new ComponentHandler()
export default handler
