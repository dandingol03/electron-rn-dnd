/**
 * Created by danding on 17/2/9.
 */


import _ from 'lodash'
import request from '../ipc/Request.js'
import TemplateCache from '../persistence/TemplateCache.js'
import RegistryCache from '../persistence/RegistryCache.js'
import {CACHE_STALE} from '../constants/CacheConstants.js'
import {
    IMPORT_MODULE,
} from '../constants/ipc/ModuleConstants.js'
import FetchUtils from '../utils/FetchUtils.js'

const _importModule = (name, version, path, registry) => {
    return {
        type: IMPORT_MODULE,
        name,
        path,
        version,
        registry,
    }
}

export const importModule = (name, version, path, registry) => {
    return request(_importModule(name, version, path, registry))
}

export const fetchTemplateText = (url) => {
    return FetchUtils.fetchResource(url).then((result) => result.text())
}

export const fetchTemplateMetadata = (url) => {
    return FetchUtils.fetchResource(url).then((result) => result.json())
}

export const fetchTemplateAndImportDependencies = (deps, textUrl, metadataUrl, path, registry) => {

    if (deps && ! _.isEmpty(deps) && path) {

        alert('dedps is not null');
        // TODO: multiple deps
        const depName = _.first(_.keys(deps))
        const depVersion = deps[depName]

        // TODO: consider waiting for npm install to finish
        importModule(depName, depVersion, path, registry)
    }

    //fetch template from template url
    const performFetch = () => {

        // Cache miss or failure - fetch text and metadata
        return Promise.all([
            fetchTemplateText(textUrl),
            fetchTemplateMetadata(metadataUrl),
        ]).then(([text, metadata]) => {

            alert('template text======\r\n'+text);
            TemplateCache.put(textUrl, metadataUrl, text, metadata)

            return {
                text,
                metadata,
            }
        })
    }

    // Always fetch local files
    if (FetchUtils.isLocal(textUrl)) {
        return performFetch()

        // Return result from cache, or fetch on failure
    } else {
        return TemplateCache.get(textUrl, metadataUrl).then(({text, metadata}) => {
            return {text, metadata}
        }).catch(performFetch)
    }

}

export const fetchModuleRegistry = (url) => {
    return RegistryCache.get(url).catch((err) => {

        const staleValue = err && err.code === CACHE_STALE && err.value

        // On cache miss, fetch
        return fetch(url).then((result) => {
            return result.json()

            // Add to cache
        }).then((packageJSON) => {
            RegistryCache.put(url, packageJSON)
            return packageJSON

            // Failed to fetch... use staleValue if available
        }).catch((err) => new Promise((resolve, reject) => {
            if (staleValue) {
                resolve(staleValue)
            } else {
                reject(err)
            }
        }))

    }).then((packageJSON) => {
        return _.get(packageJSON, 'deco.components', [])
    })
}

export const DEFAULT_REGISTRY = "https://rawgit.com/decosoftware/deco-components/master/package.json"
