/**
 * Created by danding on 17/2/11.
 */


import KeyValueStore from './KeyValueStore.js'

const NAME = 'deco-template-cache'

class TemplateCache {

    constructor() {
        this.store = new KeyValueStore(NAME)
    }

    _buildModuleId(textUrl, metadataUrl) {
        return `${textUrl}::${metadataUrl}`
    }

    put(textUrl, metadataUrl, text, metadata) {
        const id = this._buildModuleId(textUrl, metadataUrl)
        return this.store.put(id, {text, metadata})
    }

    get(textUrl, metadataUrl) {
        const id = this._buildModuleId(textUrl, metadataUrl)
        return this.store.get(id)
    }

}

export default new TemplateCache()
