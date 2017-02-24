/**
 * Created by danding on 17/2/11.
 */


import CodeMirror from 'codemirror'

import CodeMirrorRange from './CodeMirrorRange.js'
import PrimitiveTypes from '../../constants/PrimitiveTypes.js'

const NATIVE_TYPE_TO_DECO_TYPE = {
    string: PrimitiveTypes.STRING,
    number: PrimitiveTypes.NUMBER,
    atom: PrimitiveTypes.BOOLEAN,
}

/**
 * A wrapper around CodeMirror tokens
 */
class CodeMirrorToken {

    constructor(from, to, text, type) {
        this._from = from
        this._to = to
        this._text = text
        this._type = NATIVE_TYPE_TO_DECO_TYPE[type] || ''
    }

    /**
     * The starting position of this token.
     */
    get from() {
        return this._from
    }

    /**
     * The ending position of this token.
     */
    get to() {
        return this._to
    }

    get cmRange() {
        return new CodeMirrorRange(this.from, this.to)
    }

    /**
     * The token's text.
     */
    get text() {
        return this._text
    }

    /**
     * The token type the mode assigned to the token, such as "keyword" or "comment" (may also be null).
     */
    get type() {
        return this._type
    }

    static fromNativeToken(token, line) {
        if (typeof line === 'undefined') {
            throw new Error('Pass a line number when converting a native codemirror token')
        }

        return new CodeMirrorToken(
            new CodeMirror.Pos(line, token.start),
            new CodeMirror.Pos(line, token.end),
            token.string,
            token.type || ''
        )
    }

}

export default CodeMirrorToken
