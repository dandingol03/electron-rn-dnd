/**
 * Created by danding on 17/2/20.
 */
var React = require('react-native');
var {
    StyleSheet,
    View,
    ActivityIndicatorIOS
} = React;

class AcitivityIndicatorIOS extends React.Component {

    constructor()
    {
        super();
        this.state={

        };
    }

    render() {
        return (
            <View>
                <ActivityIndicatorIOS
                    style={[styles.centering, {height: 40}]}
                />
            </View>
        );
    }


}

module.exports=AcitivityIndicatorIOS;