

import React, { PropTypes, } from 'react'

const style = {
    width: 35,
    height: 20,
    flex: '0 0 auto',
}

class NavigatorHeaderButton extends React.Component {
    render() {
        const { buttonClass, onClick } = this.props
        return (
            <div
                className={buttonClass}
                style={style}
                onClick={onClick}
            />
        )
    }
}

NavigatorHeaderButton.propTypes = {
    buttonClass: PropTypes.string.isRequired,
}

export default NavigatorHeaderButton
