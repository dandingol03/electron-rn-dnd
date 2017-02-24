/**
 * Created by danding on 17/2/11.
 */


import _ from 'lodash'

class LiveValueGroupUtils {
    static getGroupsFromLiveValueMetadata(liveValueMetadata, fileId) {
        const {liveValuesById, liveValuesForFile} = liveValueMetadata
        const liveValues = _.map(liveValuesForFile[fileId], (id) => liveValuesById[id])

        // Build a map of all groupNames, filtering out liveValues without groups
        return _.chain(liveValues).map('group').filter().keyBy().value()
    }

    static getIncrementedGroupName(groupName, blacklist) {

        // If the group already exists, increment name
        let incrementer = 2
        let incrementedGroupName = groupName

        while (blacklist[incrementedGroupName]) {
            incrementedGroupName = groupName + ' ' + incrementer++
        }

        return incrementedGroupName
    }

    static setLiveValueGroups(liveValues, groupName) {
        return _.map(liveValues, (liveValue) => {

            // Only set group if no current group exists
            return _.defaults(_.cloneDeep(liveValue), {
                group: groupName,
            })
        })
    }

    static setLiveValueGroupsFromImportName(liveValues, importName, liveValueMetadata, fileId) {
        const existingGroupNames = this.getGroupsFromLiveValueMetadata(liveValueMetadata, fileId)
        const groupName = this.getIncrementedGroupName(importName, existingGroupNames)
        return this.setLiveValueGroups(liveValues, groupName)
    }
}

export default LiveValueGroupUtils
