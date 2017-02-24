/**
 * Created by danding on 17/2/11.
 */



/**
 * A wrapper around CodeMirror positions
 */
class CodeMirrorRange {

    constructor(from, to) {
        this._from = from
        this._to = to
    }

    get from() {
        return this._from
    }

    get to() {
        return this._to
    }

    /*** SERIALIZATION ***/

    toJSON() {
        return {
            to: this.to,
            from: this.from,
        }
    }

    static fromJSON(json) {
        return new CodeMirrorRange(json.to, json.from)
    }

    clone() {
        return CodeMirrorRange.fromJSON(this.toJSON())
    }

}

export default CodeMirrorRange
