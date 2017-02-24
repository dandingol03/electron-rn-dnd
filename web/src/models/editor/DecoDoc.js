/**
 * Created by danding on 17/2/12.
 */


import _ from 'lodash'

import N from '../../utils/simpleCodeMirrorPosition.js'
import CodeMirrorDocWrapper from './CodeMirrorDocWrapper.js'
import Pos from './CodeMirrorPos.js'
import DecoRange from './DecoRange.js'
import DecoRangeUtils, {DECO_RANGE_SORTBY, } from '../../utils/editor/DecoRangeUtils.js'
import {CHANGE_TYPE, } from './DecoChange.js'
import {RANGE_CHANGE_TYPE, } from './DecoRangeChange.js'
import Lock from './Lock.js'

/**
 * A Deco wrapper for a CodeMirror document.
 *
 * Contains information about metadata ranges, which are used to power Live Values.
 */
class DecoDoc extends CodeMirrorDocWrapper {

    constructor(id, code, mode, decoRanges = []) {
        super(code, mode)
        this._id = id
        this._mode = mode
        this._lock = new Lock()
        this._activeDecoRangeId = null

        // Expand decoRanges and add them to the doc
        DecoRangeUtils.expandDecoRanges(this, decoRanges)
    }

    set id(newId) {
        this._id = newId
    }

    get id() {
        return this._id
    }

    get locked() {
        return this._lock.locked
    }

    get code() {
        return this.toJSON().code
    }

    set code(value) {
        throw new Error('this replaces ranges')
    }

    /*** EDITING ***/

    edit(decoChange) {

        // Batch changes in an operation - CodeMirror will only refresh the DOM
        // and fire certain events once all changes have completed. This dramatically
        // improves the performance of composite changes
        this._nativeDoc.cm.operation(() => {
            this._edit(decoChange)
        })
    }

    _edit(decoChange) {
        switch (decoChange.type) {
            case CHANGE_TYPE.TEXT:
                this._performCMChange(decoChange.cmChange)
                break
            case CHANGE_TYPE.RANGE:
                switch (decoChange.rangeChangeType) {
                    case RANGE_CHANGE_TYPE.ADD:
                        this._addDecoRange(decoChange.decoRange)
                        break
                    case RANGE_CHANGE_TYPE.REMOVE:
                        this._removeDecoRange(decoChange.decoRange)
                        break
                }
                break
            case CHANGE_TYPE.COMPOSITE:
                _.each(decoChange.subChanges, (subChange) => {
                    this._edit(subChange)
                })
                break
        }
    }

    _performCMChange(cmChange) {
        this._lock.lock()

        const {from, to, text, origin} = cmChange
        this.cmDoc.replaceRange(text, from, to, origin)

        this._lock.unlock()
    }

    toJSON() {
        return {
            _id: this._id,
            _decoRanges: this._decoRanges,
            _lock: this._lock,
        }
    }

    /*** LIVE VALUES ***/

    getDecoRange(id) {
        const cmRange = this.getCMRange(id)
        if (cmRange) {
            return new DecoRange(id, cmRange.from, cmRange.to)
        } else {
            return null
        }
    }

    getDecoRanges(from = Pos.MIN, to = Pos.MAX, inclusive = false) {
        return _.chain(this.getCMRangeAndIdPairs(from, to, inclusive))
            .map(([id, cmRange]) => {
                return new DecoRange(id, cmRange.from, cmRange.to)
            })
            .sortBy(DECO_RANGE_SORTBY)
            .value()
    }

    get decoRanges() {
        return this.getDecoRanges()
    }

    _addDecoRange(decoRange) {
        this.addCMRange(decoRange.id, decoRange)
    }

    _removeDecoRange(decoRange) {
        if (this._activeDecoRangeId === decoRange.id) {
            this._activeDecoRangeId = null
        }

        this.removeCMRange(decoRange.id)
    }

    getDecoRangeForCMPos(cmPos, inclusive = false) {
        const pos = N(cmPos)
        return _.find(this.decoRanges, (decoRange) => {
            let from = N(decoRange.from)
            let to = N(decoRange.to)
            if (inclusive) {
                return from <= pos && pos <= to
            } else {
                return from < pos && pos < to
            }
        })
    }

    getActiveDecoRange() {
        return this.getDecoRange(this._activeDecoRangeId)
    }

    enterDecoRange(decoRange) {
        if (this._activeDecoRangeId) {
            if (this._activeDecoRangeId === decoRange.id) {
                return
            }

            this.exitDecoRange()
        }

        // console.log('enter', decoRange.id)

        this._activeDecoRangeId = decoRange.id
        this.enterCMRange(decoRange.id)
    }

    exitDecoRange() {
        if (! this._activeDecoRangeId) {
            return
        }

        // console.log('exit', this._activeDecoRangeId)

        this.exitCMRange(this._activeDecoRangeId)
        this._activeDecoRangeId = null
    }

    getCodeForDecoRanges() {
        return _.map(this.decoRanges, (decoRange) => {
            const innerRange = decoRange.withoutWhitespace()
            const codeWithinDecoRange = this.cmDoc.getRange(innerRange.from, innerRange.to)

            return {
                code: codeWithinDecoRange,
                id: decoRange.id,
            }
        })
    }

    getCodeForDecoRange(id) {
        const decoRange = this.getDecoRange(id)
        const innerRange = decoRange.withoutWhitespace()

        return this.cmDoc.getRange(innerRange.from, innerRange.to)
    }

    /*** SERIALIZATION ***/

    /**
     * Return the code, minus DecoRange whitespace
     *
     * @return {String}
     */
    toJSON() {
        return Object.assign({
            id: this.id,
            mode: this._mode,
        }, DecoRangeUtils.collapseWhitespace(this))
    }

    static fromJSON(json) {
        return new DecoDoc(json.id, json.code, json.mode, json.decoRanges)
    }
}

export default DecoDoc
