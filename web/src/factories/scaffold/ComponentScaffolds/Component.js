
import _ from 'lodash'

export default {
    name: 'Component',
    extname: '.js',
    generate: ({name}) => {
        return '' +
            `import React, { Component, } from 'react'
import { View, } from 'react-native'

class ${name} extends Component {

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View>
${'        '}
      </View>
    )
  }
}

export default ${name}`
    }
}
