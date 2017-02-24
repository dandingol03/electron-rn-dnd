
import _ from 'lodash'

export default {
    name: 'Stateless Component',
    extname: '.js',
    generate: ({name}) => {
        return '' +
            `import React from 'react'
import { View, } from 'react-native'

const ${name} = ({}) => {
  return (
    <View>
${'      '}
    </View>
  )
}

${name}.propTypes = {}
${name}.defaultProps = {}

export default ${name}`
    }
}
