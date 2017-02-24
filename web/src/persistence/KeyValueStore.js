

import sklad from 'sklad/dist/sklad.uncompressed.js'
import {CACHE_MISS, CACHE_STALE, CONN_FAILED} from '../constants/CacheConstants.js'
const IDBKeyRange = window.IDBKeyRange

// Cache for 1 week
const DEFAULT_CACHE_TIME = 7 * 24 * 60 * 60 * 1000

class KeyValueStore {

    constructor(name, options = {}) {
        if (! name) {
            throw new Error("Can't instantiate KeyValueStore without a name")
        }
        this.name = name
        this.version = (options.version || 1).toString()
        this.cacheTime = options.cacheTime != null ? options.cacheTime : DEFAULT_CACHE_TIME
        this.tableName = options.tableName || 'table'
    }

    _open() {
        const {name, version, tableName} = this
        return sklad.open(name, {
            version: version,
            migration: {
                [version]: (database) => {
                    database.createObjectStore(tableName, {keyPath: 'key'})
                }
            }
        })
    }

    put(key, value, timestamp = +Date.now()) {
        return this._open().then((conn) => {
            const record = {key, value, timestamp}
            return conn.upsert(this.tableName, record)
        })
    }

    get(key, now = +Date.now()) {
        return this._open().then((conn) => {
            const range = IDBKeyRange.only(key)
            const query = {range}
            return new Promise((resolve, reject) => {
                return conn.get(this.tableName, query).catch((err) => {
                    console.log(`Failed to get record "${key}" from cache "${this.name}:${this.tableName}"`)
                    console.log(err)
                    reject({code: CONN_FAILED})
                }).then((results) => {

                    if (results.length) {
                        const record = results[0].value
                        const {value, timestamp} = record

                        // Result is stale
                        if (timestamp + this.cacheTime < now) {
                            return reject({code: CACHE_STALE, value})
                        }

                        return resolve(value)
                    }

                    return reject({code: CACHE_MISS})
                })
            })
        })
    }

}

export default KeyValueStore
