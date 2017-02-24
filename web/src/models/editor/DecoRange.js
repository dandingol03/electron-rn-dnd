/**
 * Created by danding on 17/2/11.
 */

import CodeMirror from 'codemirror'

import CodeMirrorRange from './CodeMirrorRange.js'
import Pos from './CodeMirrorPos.js'

class DecoRange extends CodeMirrorRange {

    constructor(id, from, to) {
        super(from, to)
        this._id = id
    }

    get id() {
        return this._id
    }

    withoutWhitespace() {
        return new DecoRange(
            this.id,
            new Pos(this.from.line, this.from.ch + 1),
            new Pos(this.to.line, this.to.ch - 1)
        )
    }

    /*** SERIALIZATION ***/

    toCMRange() {
        return new CodeMirrorRange(this.from, this.to)
    }

    toJSON() {
        return Object.assign(super.toJSON(), {
            id: this.id,
        })
    }

    static fromJSON(json) {
        return new DecoRange(json.id, json.from, json.to)
    }

    clone() {
        return DecoRange.fromJSON(this.toJSON())
    }

}

export default DecoRange
