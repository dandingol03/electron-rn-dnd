/**
 * Created by danding on 17/2/11.
 */


import DecoChange, {CHANGE_TYPE, } from './DecoChange.js'
import DecoRange from './DecoRange.js'
import Enum from '../../utils/Enum.js'

export const RANGE_CHANGE_TYPE = Enum(
    'ADD',
    'REMOVE'
)

const RANGE_CHANGE_TYPE_INVERSE = {
    [RANGE_CHANGE_TYPE.ADD]: RANGE_CHANGE_TYPE.REMOVE,
    [RANGE_CHANGE_TYPE.REMOVE]: RANGE_CHANGE_TYPE.ADD,
}

class DecoRangeChange extends DecoChange {

    constructor(decoRange, rangeChangeType) {
        super()
        this._decoRange = decoRange
        this._rangeChangeType = rangeChangeType
    }

    get type() {
        return CHANGE_TYPE.RANGE
    }

    get rangeChangeType() {
        return this._rangeChangeType
    }

    get decoRange() {
        return this._decoRange
    }

    invert() {
        return new DecoRangeChange(
            this._decoRange,
            RANGE_CHANGE_TYPE_INVERSE[this._rangeChangeType]
        )
    }

    /*** SERIALIZATION ***/

    toJSON() {
        return {
            type: this.type,
            decoRange: this.decoRange.toJSON(),
            rangeChangeType: this.rangeChangeType,
        }
    }

    static fromJSON(json) {
        const decoRange = DecoRange.fromJSON(json.decoRange)
        return new DecoRangeChange(decoRange, json.rangeChangeType)
    }

    clone() {
        return DecoRangeChange.fromJSON(this.toJSON())
    }

}

DecoRangeChange.RANGE_CHANGE_TYPE = RANGE_CHANGE_TYPE

export default DecoRangeChange
