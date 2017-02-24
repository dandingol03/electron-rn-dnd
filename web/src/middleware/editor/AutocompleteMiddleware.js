/**
 * Created by danding on 17/2/11.
 */


import CodeMirror from 'codemirror'

import Middleware from '../Middleware.js'
import CodeMirrorEventTypes from '../../constants/CodeMirrorEventTypes.js'
import Pos from '../../models/editor/CodeMirrorPos.js'

/**
 * Middleware for showing autocompletions while typing
 */
class AutocompleteMiddleware extends Middleware {

    constructor() {
        super()

        this._keyMap = {
            [CodeMirrorEventTypes.changes]: this._changes.bind(this),
        }
    }

    get eventListeners() {
        return this._keyMap
    }

    _changes(cm, changes) {

        // Do nothing if popup is already open
        if (cm.state.completionActive) {
            return
        }

        // Only show popup if the last change was a user input event
        // http://stackoverflow.com/questions/26174164/auto-complete-with-codemirrror
        const origin = changes[changes.length - 1].origin
        if (! (origin === '+input' || origin === '+delete')) {
            return
        }

        const range = cm.listSelections()[0]
        const from = range.from()

        if (range.empty()) {
            const textBefore = cm.getRange(new Pos(from.line, 0), from)

            // Show popup if the user has typed at least 2 characters
            if (textBefore.match(/[\w$]{2,}$/)) {
                cm.showHint({
                    completeSingle: false,
                })
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

const middleware = new AutocompleteMiddleware()

export default (dispatch) => {
    middleware.setDispatchFunction(dispatch)
    return middleware
}
