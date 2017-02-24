/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
    ActivityIndicatorIOS
} = React;

import Explorer from './preview/src/UIExplorer/UIExplorerApp.web';


var ReactNativeWebExample = React.createClass({
  render: function() {

      // var title = React.createElement('Text', null, 'First Text Content');

      var title=React.createElement(ActivityIndicatorIOS,
          {
            animating:true,
              style:{alignItems:'center',justifyContent:'center',height:80},
              size:'large'
          },null);

      return (
      <View style={styles.container}>
          {title}
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNativeWebExample', () => Explorer);


if(Platform.OS == 'web'){
  var app = document.createElement('div');
  document.body.appendChild(app);

  AppRegistry.runApplication('ReactNativeWebExample', {
    rootTag: app
  })
}
