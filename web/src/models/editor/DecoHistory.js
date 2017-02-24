/**
 * Created by danding on 17/2/13.
 */


import _ from 'lodash'

import DecoChangeFactory from '../../factories/editor/DecoChangeFactory.js'
import DecoHistoryEntry from './DecoHistoryEntry.js'

class DecoHistory {

    constructor(undo = [], redo = []) {
        this._redo = redo
        this._undo = undo
    }

    addToHistory(decoChange) {
        let entry = new DecoHistoryEntry(decoChange)

        // If there's at least one history entry
        if (this._undo.length > 0) {
            const previousEntry = this._undo[this._undo.length - 1]

            // Attempt to merge the previous entry with this new entry
            if (previousEntry.shouldMergeWith(entry)) {
                this._undo.pop()
                entry = previousEntry.mergeWith(entry)
            }
        }

        this._undo.push(entry)
        this._redo.length = 0
    }

    getUndoStackTop() {
        if (! this.canUndo()) {
            throw new Error("Can't get undo stack top - stack is empty. Call canUndo() first")
        }

        return this._undo[this._undo.length - 1].decoChange
    }

    getRedoStackTop() {
        if (! this.canRedo()) {
            throw new Error("Can't get redo stack top - stack is empty. Call canRedo() first")
        }

        return this._redo[this._redo.length - 1].decoChange
    }

    undo() {
        if (! this.canUndo()) {
            throw new Error("Can't undo - stack is empty. Call canUndo() first")
        }

        const entry = this._undo.pop()
        this._redo.push(entry)
        return entry.decoChange
    }

    redo() {
        if (! this.canRedo()) {
            throw new Error("Can't redo - stack is empty. Call canRedo() first")
        }

        const entry = this._redo.pop()
        this._undo.push(entry)
        return entry.decoChange
    }

    canUndo() {
        return this._undo.length > 0
    }

    canRedo() {
        return this._redo.length > 0
    }

    /*** SERIALIZATION ***/

    toJSON() {
        return {
            undo: _.invokeMap(this._undo, 'toJSON'),
            redo: _.invokeMap(this._redo, 'toJSON'),
        }
    }

    static fromJSON(json) {
        return new DecoHistory(
            _.map(json.undo, DecoHistoryEntry.fromJSON),
            _.map(json.redo, DecoHistoryEntry.fromJSON)
        )
    }

    clone() {
        return DecoHistory.fromJSON(this.toJSON())
    }

}

export default DecoHistory
