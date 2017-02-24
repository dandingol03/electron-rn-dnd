/**
 * Created by danding on 17/2/10.
 */


import _ from 'lodash'

import {
    SIMULATOR_STATUS,
    PACKAGER_STATUS,
    PACKAGER_OUTPUT,
    GET_AVAILABLE_SIMULATORS,
    CONFIG_ERROR_MESSAGE
} from '../actions/applicationActions'

import { ProcessStatus, } from '../constants/ProcessStatus'

const CHAR_LIMIT_OUTPUT = 250000

const initialState = {
    simulatorStatus: ProcessStatus.OFF,
    packagerStatus: ProcessStatus.OFF,
    packagerOutput: '',
    availableSimulatorsIOS: {
        simList: [],
    },
    availableSimulatorsAndroid: {
        simList: [],
    },
    configError: '',
}

const applicationReducer = (state = initialState, action) => {
    switch(action.type) {
        case SIMULATOR_STATUS:
            return Object.assign({}, state, {
                simulatorStatus: action.status,
            })
        case PACKAGER_STATUS:
            return Object.assign({}, state, {
                packagerStatus: action.status,
            })
        case PACKAGER_OUTPUT:
            let output = state.packagerOutput + action.output
            //allow 10k characters for now
            if (output.length > CHAR_LIMIT_OUTPUT) {
                output = output.slice(action.output.length, output.length)
            }
            return Object.assign({}, state, {
                packagerOutput: output,
            })
        case GET_AVAILABLE_SIMULATORS:
            switch (action.platform) {
                case 'ios':
                    return {
                        ...state,
                        availableSimulatorsIOS: {
                            error: action.error,
                            ...action.payload,
                        }
                    }
                case 'android':
                    return {
                        ...state,
                        availableSimulatorsAndroid: {
                            error: action.error,
                            ...action.payload,
                        }
                    }
                default:
                    return state
            }
        case CONFIG_ERROR_MESSAGE:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}

export default applicationReducer
