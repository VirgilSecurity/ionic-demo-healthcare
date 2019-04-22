import React from 'react';

const PageSection: React.FC = props => (
    <div
        style={{
            padding: '20px',
            minHeight: '211px',
        }}
    >
        {props.children}
    </div>
);

export default PageSection;