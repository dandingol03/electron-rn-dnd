

import React, { Component, PropTypes, } from 'react'

import NavigatorHeaderButton from './NavigatorHeaderButton.jsx'
import DropdownMenuButton from '../buttons/DropdownMenuButton.jsx'
import TwoStateButton from '../buttons/TwoStateButton.jsx'
import LandingButton from '../buttons/LandingButton.jsx'
import NewIcon from '../display/NewIcon.jsx'

export default ({
    node, scaffolds, onCreateSubFile, onCreateSubDir, onVisibilityChange, visible,
}) => {
    const scaffoldOptions = scaffolds.map(({name, id}) => {
        return {
            text: `New ${name}`,
            action: () => onCreateSubFile(node, id),
        }
    })

    const options = [
        { text: 'New File', action: () => onCreateSubFile(node) },
        ...scaffoldOptions,
    ]

    return (
        <DropdownMenuButton
            onVisibilityChange={onVisibilityChange}
            renderContent={() =>
                <div className={'helvetica-smooth'}>
                    {_.map(options, ({text, action}, i) => (
                        <div key={i}
                             style={{
                                 marginBottom: i === options.length - 1 ? 0 : 6,
                                 marginRight: 10,
                                 marginLeft: 10,
                             }}>
                            <LandingButton
                                align={'flex-start'}
                                onClick={action}>
                                <NewIcon />
                                {text}
                            </LandingButton>
                        </div>
                    ))}
                </div>
            }>
            <TwoStateButton
                enabled={visible}
                hoverStyle={{ opacity: 0.75 }}
                enabledStyle={{ opacity: 0.5 }}>
                <div>
                    <NavigatorHeaderButton
                        buttonClass={'icon-plus'}
                    />
                </div>
            </TwoStateButton>
        </DropdownMenuButton>
    )
}
