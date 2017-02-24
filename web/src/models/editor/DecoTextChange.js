/**
 * Created by danding on 17/2/11.
 */


import DecoChange, {CHANGE_TYPE, } from './DecoChange.js'
import CodeMirrorChange from './CodeMirrorChange.js'

class DecoTextChange extends DecoChange {

    constructor(cmChange) {
        super()
        this._cmChange = cmChange
    }

    get type() {
        return CHANGE_TYPE.TEXT
    }

    get cmChange() {
        return this._cmChange
    }

    invert() {
        return new DecoTextChange(this._cmChange.invert())
    }

    /*** SERIALIZATION ***/

    toJSON() {
        return {
            type: this.type,
            cmChange: this.cmChange.toJSON(),
        }
    }

    static fromJSON(json) {
        const cmChange = CodeMirrorChange.fromJSON(json.cmChange)
        return new DecoTextChange(cmChange)
    }

    clone() {
        return DecoTextChange.fromJSON(this.toJSON())
    }

}

export default DecoTextChange
