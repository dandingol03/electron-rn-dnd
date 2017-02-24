/**
 * Created by danding on 17/2/11.
 */


import CodeMirror from 'codemirror'

import {edit, undo, redo, markDirty} from '../../actions/editorActions.js'
import { markUnsaved } from '../../actions/fileActions.js'
import { makeTabPermanent } from '../../actions/tabActions.js'
import { CONTENT_PANES } from '../../constants/LayoutConstants.js'
import Middleware from '../Middleware.js'
import CodeMirrorEventTypes from '../../constants/CodeMirrorEventTypes.js'
import DecoChangeFactory from '../../factories/editor/DecoChangeFactory.js'
import CodeMirrorChange from '../../models/editor/CodeMirrorChange'


/**
 * Middleware for custom history management
 */
class HistoryMiddleware extends Middleware {

    constructor() {
        super()
        this._keyMap = {
            [CodeMirrorEventTypes.beforeChange]: this._onBeforeChange.bind(this),
            [CodeMirrorEventTypes.changes]: this._onChanges.bind(this),
        }
    }

    get eventListeners() {
        return this._keyMap
    }

    attach(decoDoc) {
        if (!decoDoc) {
            return
        }

        this._decoDoc = decoDoc
        this._changeId = null

        this._oldCommands = {
            undo: CodeMirror.commands.undo,
            redo: CodeMirror.commands.redo,
        }

        CodeMirror.commands.undo = this._undo.bind(this)
        CodeMirror.commands.redo = this._redo.bind(this)
    }

    detach() {
        if (!this._decoDoc) {
            return
        }

        this._decoDoc = null
        this._changeId = null

        CodeMirror.commands.undo = this._oldCommands.undo
        CodeMirror.commands.redo = this._oldCommands.redo
    }

    _undo() {
        this.dispatch(undo(this._decoDoc.id))
    }

    _redo() {
        this.dispatch(redo(this._decoDoc.id))
    }

    // A batched version of onChange, for performance
    _onChanges() {
        if (this._decoDoc.isClean() || !this._changeId) {
            this._changeId = this._decoDoc.changeGeneration()
            this.dispatch(markUnsaved(this._decoDoc.id))
            this.dispatch(markDirty(this._decoDoc.id))
            this.dispatch(makeTabPermanent(CONTENT_PANES.CENTER))
        }
    }

    _onBeforeChange(cm, change) {
        if (! this._decoDoc.locked) {
            change.cancel()

            const cmChange = new CodeMirrorChange(
                change.from,
                change.to,
                change.text,
                cm.getRange(change.from, change.to),
                change.origin
            )

            const decoChange = DecoChangeFactory.createChangeFromCMChange(cmChange)
            this.dispatch(edit(this._decoDoc.id, decoChange))

            return
        }
    }

}

const middleware = new HistoryMiddleware()

export default (dispatch) => {
    middleware.setDispatchFunction(dispatch)
    return middleware
}
