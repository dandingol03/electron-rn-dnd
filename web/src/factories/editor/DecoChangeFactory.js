/**
 * Created by danding on 17/2/11.
 */

import _ from 'lodash'

import {CHANGE_TYPE, } from '../../models/editor/DecoChange'
import CodeMirrorChange from '../../models/editor/CodeMirrorChange.js'
import DecoTextChange from '../../models/editor/DecoTextChange.js'
import DecoRangeChange, {RANGE_CHANGE_TYPE} from '../../models/editor/DecoRangeChange.js'
import DecoCompositeChange from '../../models/editor/DecoCompositeChange'

const CONSTRUCTORS = {
    [CHANGE_TYPE.TEXT]: DecoTextChange,
    [CHANGE_TYPE.RANGE]: DecoRangeChange,
    [CHANGE_TYPE.COMPOSITE]: DecoCompositeChange,
}

class DecoChangeFactory {

    static createChangeFromCMChange(cmChange) {
        return new DecoTextChange(cmChange)
    }

    static createChangeToAddDecoRange(decoRange) {
        return new DecoRangeChange(decoRange, RANGE_CHANGE_TYPE.ADD)
    }

    static createChangeToAddDecoRanges(decoRanges) {
        return this.createCompositeChange(_.map(decoRanges, (decoRange) => {
            return new DecoRangeChange(decoRange, RANGE_CHANGE_TYPE.ADD)
        }))
    }

    static createChangeToRemoveDecoRange(decoRange) {
        return new DecoRangeChange(decoRange, RANGE_CHANGE_TYPE.REMOVE)
    }

    static createChangeToRemoveDecoRanges(decoRanges) {
        const subChanges = _.map(decoRanges, (decoRange) => {
            return new DecoRangeChange(decoRange, RANGE_CHANGE_TYPE.REMOVE)
        })
        return new DecoCompositeChange(subChanges)
    }

    static createCompositeChange(decoChanges) {
        return new DecoCompositeChange(decoChanges)
    }

    static createChangeToSetText(from, to, text, originalText) {
        const cmChange = new CodeMirrorChange(from, to, text, originalText)
        return new DecoTextChange(cmChange)
    }

    static createChangeFromJSON(json) {
        return CONSTRUCTORS[json.type].fromJSON(json)
    }

}

export default DecoChangeFactory
