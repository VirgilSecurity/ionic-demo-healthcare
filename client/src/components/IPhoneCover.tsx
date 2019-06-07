import img from "../iphone-frame.png";
import React from "react";


export default class IPhoneCover extends React.Component {
    render() {
        const { children, ...rest } = this.props;
        return (
            <div
                {...rest}
                style={{
                    backgroundSize: "cover",
                    backgroundImage: `url(${img})`,
                    width: "100%",
                    paddingTop: "200%",
                    height: 0,
                    position: 'relative'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '8%',
                    right: '8%',
                    bottom: '8%'
                }}>{children}</div>
            </div>
        );
    }
}
