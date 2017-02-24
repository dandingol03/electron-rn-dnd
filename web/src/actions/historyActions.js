
export const CREATE_HISTORY = 'CREATE_HISTORY'
export const createHistory = (id) => {
    return {
        type: CREATE_HISTORY,
        payload: {
            id,
        },
    }
}

export const ADD_TO_HISTORY = 'ADD_TO_HISTORY'
export const addToHistory = (id, decoChange) => {
    return {
        type: ADD_TO_HISTORY,
        payload: {
            id,
            decoChange,
        }
    }
}

export const UNDO_FROM_HISTORY = 'UNDO_FROM_HISTORY'
export const undoFromHistory = (id) => {
    return {
        type: UNDO_FROM_HISTORY,
        payload: {
            id,
        },
    }
}

export const REDO_TO_HISTORY = 'REDO_TO_HISTORY'
export const redoToHistory = (id) => {
    return {
        type: REDO_TO_HISTORY,
        payload: {
            id,
        },
    }
}

export const HISTORY_ID_CHANGE = 'HISTORY_ID_CHANGE'
export const historyIdChange = (oldId, newId) => {
    return {
        type: HISTORY_ID_CHANGE,
        oldId,
        newId,
    }
}
