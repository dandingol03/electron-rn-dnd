/**
 * Created by danding on 17/2/11.
 */


import _ from 'lodash'

function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
}

// https://webpack.github.io/docs/context.html#context-module-api
const templates = requireAll(require.context("./ReactNativeScaffolds/", false, /.json$/))
const coreSubFactories = _.keyBy(templates, 'name')

const coreItems = _.map(templates, (template) => {
    return {
        name: template.name,
        module: template.parentModule,
    }
})

class ScaffoldFactory {
    static items() {
        return coreItems
    }

    static makeCoreComponents() {
        let coreComponents = {}
        _.each(coreItems, (coreItem) => {
            coreComponents[coreItem.name] = coreSubFactories[coreItem.name]
        })
        return coreComponents
    }
}

export default ScaffoldFactory
