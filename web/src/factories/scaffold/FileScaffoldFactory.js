
import _ from 'lodash'
import path from 'path'

// https://webpack.github.io/docs/context.html#context-module-api
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
const context = require.context("./ComponentScaffolds/", false, /.js$/)

// {name, generate({name}) => text}
const scaffolds = _.map(requireAll(context), (scaffold, i) => {
    return {
        ...scaffold,
        id: i,
    }
})

const scaffoldMetadata = _.map(scaffolds, ({name, id}) => {
    return {name, id}
})

const scaffoldsById = _.keyBy(scaffolds, 'id')

export default {

    /**
     * Returns an array of {name, id}
     * @return {Object[]}
     */
    getScaffolds: () => scaffoldMetadata,

    /**
     * Generates a scaffold from a scaffold id and params
     * @param  {Number} id
     * @param  {Object} params
     * @return {string}        Scaffold text
     */
    generateScaffold: (id, params) => {
        const scaffold = scaffoldsById[id]

        const {filename = ''} = params
        const basename = path.basename(filename, path.extname(filename))
        const name = _.upperFirst(_.camelCase(basename))

        return scaffold.generate({
            ...params,
            name,
        })
    },

    /**
     * Automatically add extension to filename if omitted
     * @param  {Number} id
     * @param  {String} filename
     * @return {String}          New filename
     */
    updateFilename: (id, filename) => {
        const scaffold = scaffoldsById[id]

        if (scaffold.extname && path.extname(filename) === '') {
            return filename + scaffold.extname
        } else {
            return filename
        }
    },
}
