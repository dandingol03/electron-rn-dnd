/**
 * Created by danding on 17/2/13.
 */


import _ from 'lodash'

import DecoChangeFactory from '../../factories/editor/DecoChangeFactory.js'

class DecoHistoryEntry {

    constructor(decoChange, timestamp = new Date()) {
        this._decoChange = decoChange
        this._timestamp = timestamp
    }

    get decoChange() {
        return this._decoChange
    }

    get timestamp() {
        return this._timestamp
    }

    shouldMergeWith(otherHistoryEntry) {
        return Math.abs(this.timestamp - otherHistoryEntry.timestamp) < 200
    }

    mergeWith(otherHistoryEntry) {
        return new DecoHistoryEntry(
            DecoChangeFactory.createCompositeChange([
                this.decoChange.clone(),
                otherHistoryEntry.decoChange.clone(),
            ]),
            otherHistoryEntry.timestamp
        )
    }

    /*** SERIALIZATION ***/

    toJSON() {
        return {
            decoChange: this._decoChange.toJSON(),
            timestamp: +this._timestamp,
        }
    }

    static fromJSON(json) {
        return new DecoHistoryEntry(
            DecoChangeFactory.createChangeFromJSON(json.decoChange),
            new Date(json.timestamp)
        )
    }

    clone() {
        return DecoHistoryEntry.fromJSON(this.toJSON())
    }

}

export default DecoHistoryEntry
