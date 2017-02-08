/**
 * Created by danding on 17/2/5.
 */


import _ from 'lodash'

import LocalStorage from '../persistence/LocalStorage'

const RECENT_PROJECTS_KEY = 'RECENT_PROJECTS'

export default {
    addProjectPath(path) {
        const saved = LocalStorage.loadObject(RECENT_PROJECTS_KEY)
        const savedPaths = saved.paths || []
        const paths = _.chain([path, ...savedPaths])
            .union()
            .take(10)
            .value()

        LocalStorage.saveObject(RECENT_PROJECTS_KEY, {
            ...saved,
            paths,
        })
    },
    getProjectPaths() {
        const saved = LocalStorage.loadObject(RECENT_PROJECTS_KEY)
        return saved.paths || []
    },
}
