/**
 * Created by danding on 17/2/9.
 */


import React from 'react'
import { pushModal } from '../actions/uiActions'
import {
    importModule,
    fetchTemplateText
} from '../api/ModuleClient'
import {
    insertTemplate
} from '../actions/editorActions'
import NamingBanner from '../components/modal/NamingBanner'
import { getRootPath } from '../utils/PathUtils'
import { CATEGORIES, METADATA, PREFERENCES } from 'shared/constants/PreferencesConstants'

export const openInstallModuleDialog = () => (dispatch, getState) => {
    const dialog = (
        <NamingBanner
    bannerText={'Install module'}
    onTextDone={(name) => {
        const state = getState()
        const registry = state.preferences[CATEGORIES.EDITOR][PREFERENCES.EDITOR.NPM_REGISTRY]
        importModule(name, 'latest', getRootPath(state), registry)
    }} />
    )
    dispatch(pushModal(dialog, true))
}

export const openImportTemplateDialog = () => (dispatch, getState) => {
    const dialog = (
        <NamingBanner
    bannerText={'Import template'}
    onTextDone={(url) => {
        dispatch(fetchTemplateText(url)).then((text) => {
            const {openDocId, docCache} = getState().editor

            if (docCache && docCache[openDocId]) {
                dispatch(insertTemplate(docCache[openDocId], text))
            }
        })
    }} />
    )
    dispatch(pushModal(dialog, true))
}
