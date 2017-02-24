/**
 * Created by danding on 17/2/11.
 */


import KeyValueStore from './KeyValueStore.js'

const NAME = 'deco-registry-cache'

// For now, always fetch. Cache is always stale.
export default new KeyValueStore(NAME, {
    cacheTime: 0,
})
