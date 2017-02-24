/**
 * Created by danding on 17/2/11.
 */


import CodeMirror from 'codemirror'

import {
    enableTokenHighlighting,
    disableTokenHighlighting,
    addDecoRangeFromCMToken,
} from '../../actions/editorActions.js'

import Middleware from '../Middleware.js'
import CodeMirrorEventTypes from '../../constants/CodeMirrorEventTypes.js'
import CodeMirrorToken from '../../models/editor/CodeMirrorToken.js'
import PrimitiveTypes from '../../constants/PrimitiveTypes.js'

const TOKEN_TYPES = [
    PrimitiveTypes.STRING,
    PrimitiveTypes.NUMBER,
    PrimitiveTypes.BOOLEAN,
]

/**
 * Middleware for highlighting and clicking specific token types
 */
class TokenMiddleware extends Middleware {

    constructor() {
        super()

        this._keyMap = {
            [CodeMirrorEventTypes.keyUp]: this._keyUp.bind(this),
            [CodeMirrorEventTypes.keyDown]: this._keyDown.bind(this),
            [CodeMirrorEventTypes.blur]: this._blur.bind(this),
            [CodeMirrorEventTypes.mouseDown]: this._mouseDown.bind(this),
        }
    }

    get eventListeners() {
        return this._keyMap
    }

    _keyDown(cm, e) {
        if (e.altKey) {
            this.dispatch(enableTokenHighlighting())
        }
    }

    _keyUp(cm, e) {
        this.dispatch(disableTokenHighlighting())
    }

    _blur(cm, e) {
        this.dispatch(disableTokenHighlighting())
    }

    _getTokenAt(cm, pos, precise = false) {
        const nativeToken = cm.getTokenAt(pos, precise)
        return CodeMirrorToken.fromNativeToken(nativeToken, pos.line)
    }

    _findNearestLiteralToken(cm, pos) {
        let token = this._getTokenAt(cm, pos)

        // Clicks on the left side of a char (xRel === 1) identify the previous token.
        // If the token at `pos` is not interesting, try the next char.
        if (pos.xRel === 1 && token.type === '') {
            const nextPos = new CodeMirror.Pos(pos.line, pos.ch + 1)
            token = this._getTokenAt(cm, pos)
        }

        return token
    }

    _mouseDown(cm, e) {
        if (e.altKey) {
            e.stopPropagation()
            e.preventDefault()

            const clickCoords = {
                left: e.pageX,
                top: e.pageY,
            }

            const clickPos = cm.coordsChar(clickCoords, 'page')
            const token = this._findNearestLiteralToken(cm, clickPos)

            if (token.type && TOKEN_TYPES.indexOf(token.type) >= 0) {
                // console.log('click token', clickPos, token)
                this.dispatch(addDecoRangeFromCMToken(this._decoDoc.id, token))
            }

        }
    }

    attach(decoDoc) {
        if (!decoDoc) {
            return
        }

        this._decoDoc = decoDoc
    }

    detach() {
        if (!this._decoDoc) {
            return
        }

        this._decoDoc = null
    }

}

const middleware = new TokenMiddleware()

export default (dispatch) => {
    middleware.setDispatchFunction(dispatch)
    return middleware
}
