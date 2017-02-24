/**
 * Created by danding on 17/2/11.
 */


import {
    ON_COMPONENT_LIST,
    LOAD_COMPONENT_METADATA,
} from '../../actions/componentActions.js'

import ScaffoldFactory from '../../factories/scaffold/ScaffoldFactory.js'

const initialState = {
    coreList: ScaffoldFactory.items(),
    coreComponents: ScaffoldFactory.makeCoreComponents(),
    componentList: [],
    localComponents: {},
}

const componentReducer = (state = initialState, action) => {
    switch(action.type) {
        case ON_COMPONENT_LIST:
            return Object.assign({}, state, {
                componentList: action.list,
            })
        case LOAD_COMPONENT_METADATA:
            //skip module components, they already exist
            if (action.module) {
                return state
            }
            return Object.assign({}, state, {
                localComponents: Object.assign({},
                    state.localComponents,
                    {
                        [action.name]: action.metadata
                    }
                )
            })
        default:
            return state
    }
}

export default componentReducer
