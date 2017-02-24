/**
 * Created by danding on 17/2/11.
 */


import _ from 'lodash'

class ASTUtils {

    //supports deconstructed requires and es6 imports
    static importASTtoString(ast) {
        const spacer = '  '
        let result = ''
        if (ast.body[0].type == 'ImportDeclaration') {
            result = 'import {\n'
            const defaultImports = _.filter(ast.body[0].specifiers, (specifier) => {
                return specifier.type == 'ImportDefaultSpecifier'
            })
            if (defaultImports.length > 0) {
                result = 'import ' + defaultImports[0].local.name + ', {\n'
            }
            _.each(ast.body[0].specifiers, (specifier) => {
                if (specifier.type != 'ImportDefaultSpecifier') {
                    result += spacer + specifier.local.name + ',\n'
                }
            })
            result += '} from ' + ast.body[0].source.raw
        }
        if (ast.body[0].type == 'VariableDeclaration') {
            result = 'const {\n'
            _.each(ast.body[0].declarations[0].id.properties, (property) => {
                result += spacer + property.key.name + ',\n'
            })
            result += '} = require(' + ast.body[0].declarations[0].init.arguments[0].raw + ')'
        }
        return result
    }
}

export default ASTUtils
