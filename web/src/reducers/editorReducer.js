/**
 * Created by danding on 17/2/10.
 */

import CodeMirror from 'codemirror'
import _ from 'lodash'

import DecoDoc from '../models/editor/DecoDoc.js'
import {
    CLEAR_EDITOR_STATE,
    SET_CURRENT_DOC,
    CACHE_DOC,
    MARK_DIRTY,
    MARK_CLEAN,
    OPERATION_EDIT,
    OPERATION_UNDO,
    OPERATION_REDO,
    DOC_ID_CHANGE,
    HIGHLIGHT_LITERAL_TOKENS,
} from '../actions/editorActions.js'

const initialState = {
    highlightLiteralTokens: false,
    dirtyMap: {},
}

const editorReducer = (state = initialState, action) => {
    let cache = state.docCache || {}
    let id
    let dirtyList = Object.assign({}, state.dirtyList)

    switch(action.type) {
        case OPERATION_EDIT:
        case OPERATION_UNDO:
        case OPERATION_REDO:
            return state
        case HIGHLIGHT_LITERAL_TOKENS:
            return Object.assign({}, state, {
                highlightLiteralTokens: action.payload
            })
        case CLEAR_EDITOR_STATE:
            console.log('reducer===========CLEAR_EDITOR_STATE');
            _.each(state.docCache, (doc, id) => {
                console.log(id+'in docCache\r\n'+doc);
                delete state.docCache[id]
            })
            return Object.assign({}, initialState)
        case SET_CURRENT_DOC:
            return Object.assign({}, state, {
                openDocId: action.id,
            })
        case DOC_ID_CHANGE:
            let openDocId = state.openDocId
            if (openDocId.includes(action.oldId)) {
                openDocId = openDocId.replace(action.oldId, action.newId)
            }

            //check if this is a file first that is present
            if (_.has(cache, action.oldId)) {
                cache[action.newId] = cache[action.oldId]
                cache[action.newId].id = action.newId
                delete cache[action.oldId]
                return Object.assign({}, state, {
                    docCache: cache,
                    openDocId: openDocId,
                })
            }
            //still possibly sub docs present if the id change is of a folder
            _.each(_.keys(cache), (key) => {
                if (key.includes(action.oldId)) {
                    const newSubId = key.replace(action.oldId, action.newId)
                    cache[newSubId] = cache[key]
                    cache[newSubId].id = newSubId
                    delete cache[key]
                }
            })
            console.log('doc id change')
            return Object.assign({}, state, {
                docCache: cache,
                openDocId: openDocId,
            })
        case CACHE_DOC:
            // we compare values and invalidate if the change generation is 0
            //if we havn't cache this fileid yet
            if (!_.has(cache, action.id)) {
                cache[action.id] = new DecoDoc(action.id, action.data, 'jsx', action.decoRanges)
            }
            return Object.assign({}, state, {
                docCache: cache,
            })
        case MARK_DIRTY:
            if (cache[action.id]) {
                if (!dirtyList[action.id]) {
                    dirtyList[action.id] = true
                }
                return Object.assign({}, state, {
                    dirtyList: dirtyList,
                })
            }
            return state
        case MARK_CLEAN:
            if (cache[action.id]) {
                cache = Object.assign({}, state.docCache)
                cache[action.id].markClean()
                delete dirtyList[action.id]
                return Object.assign({}, state, {
                    docCache: cache,
                    dirtyList: dirtyList,
                })
            }
            return state
        default:
            return state
    }
}

export default editorReducer
