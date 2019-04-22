import React, { CSSProperties } from "react";
import { ReadonlyColumnModel } from "../models/ReadonlyColumnModel";
import { observer } from "mobx-react";
import { Lock, CloudDownload, WaitingIcon } from "./Icons";


export interface IReadonlyColumnComponentProps {
    title: string;
    model: ReadonlyColumnModel;
    style?: CSSProperties;
}

@observer
export default class ReadonlyColumnComponent extends React.Component<
    IReadonlyColumnComponentProps
> {
    render() {
        return (
            <div style={this.props.style}>
                <b>{this.props.title}</b>
                <div style={{ overflow: "hidden", wordBreak: "break-all" }}>{this.renderBody()}</div>
            </div>
        );
    }

    private renderBody = () => {
        const { state, value } = this.props.model;
        if (state === "Waiting") {
            return <><WaitingIcon />Waiting for user data</>;
        }

        if (state === "Decrypting") {
            return <>decrypting</>;
        }

        if (state === "Ready") {
            return <><CloudDownload />{value}</>;
        }

        if (state === "Unable To Decrypt") {
            return (
                <>
                    <Lock />
                    Failed to decrypt
                </>
            );
        }
    };
}
