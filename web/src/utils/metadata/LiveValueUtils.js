/**
 * Created by danding on 17/2/5.
 */


import _ from 'lodash'
import PrimitiveTypes from '../../constants/PrimitiveTypes.js'
import { EDIT_WITH, DROPDOWN_OPTIONS, } from '../../constants/LiveValueConstants.js'
import { parseColor } from '../CSSColorParser.js'
import { toValue } from '../Parser.js'
import uuid from '../uuid.js'
import DecoRange from '../../models/editor/DecoRange.js'
import Pos from '../../models/editor/CodeMirrorPos.js'

class LiveValueUtils {
    static guessLiveValueMetadata(name, type, text) {
        const metadata = {}

        if (type === PrimitiveTypes.STRING) {
            const value = toValue(text)
            const color = parseColor(value)

            if (color) {
                metadata.editWith = EDIT_WITH.COLOR_PICKER
            } else if (DROPDOWN_OPTIONS[name]) {
                metadata.editWith = EDIT_WITH.DROPDOWN
                metadata.dropdownOptions = name
            } else {
                metadata.editWith = EDIT_WITH.INPUT_FIELD
            }
        }

        return metadata
    }

    static denormalizeLiveValueMetadata(decoRanges, liveValuesById) {
        const liveValues = _.map(decoRanges, (decoRange) => {
            return Object.assign({
                range: {
                    from: decoRange.from,
                    to: decoRange.to,
                },
            }, liveValuesById[decoRange.id])
        })

        return liveValues
    }

    static denormalizeLiveValueMetadataFromDoc(liveValueMetadata, decoDoc) {
        const {liveValuesById} = liveValueMetadata
        const {decoRanges} = decoDoc.toJSON()
        return this.denormalizeLiveValueMetadata(decoRanges, liveValuesById)
    }

    static normalizeLiveValueMetadata(liveValues = []) {
        const liveValueIds = []
        const liveValuesById = {}
        const decoRanges = []

        _.each(liveValues, (liveValueJSON) => {
            const liveValueId = uuid()
            const {from, to} = liveValueJSON.range

            // Extract position info
            decoRanges.push(new DecoRange(
                liveValueId,
                new Pos(from.line, from.ch),
                new Pos(to.line, to.ch)
            ))

            const liveValueMetadata = _.cloneDeep(liveValueJSON)
            delete liveValueMetadata.range

            liveValueIds.push(liveValueId)
            liveValuesById[liveValueId] = liveValueMetadata
        })

        return {
            liveValueIds,
            liveValuesById,
            decoRanges,
        }
    }
}

export default LiveValueUtils
