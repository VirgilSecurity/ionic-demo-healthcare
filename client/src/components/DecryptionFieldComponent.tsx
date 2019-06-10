import React, { CSSProperties } from "react";
import { DecryptionFieldModel } from "../models/DecryptionField";
import { observer } from "mobx-react";
import { Lock, CloudDownload, WaitingIcon } from "./Icons";


export interface IDecryptionFieldComponentProps {
    title: string;
    model: DecryptionFieldModel;
    waitingFor: string;
    style?: CSSProperties;
}

@observer
export default class DecryptionFieldComponent extends React.Component<
    IDecryptionFieldComponentProps
> {
    render() {
        return (
            <div style={{ ...this.props.style, paddingBottom: 20 }}>
                <b>{this.props.title}</b>
                <div style={{ overflow: "hidden", wordBreak: "break-all", color: this.getColor() }}>{this.renderBody()}</div>
            </div>
        );
    }

    private getColor = () => {
        return this.props.model.state === 'Unable To Decrypt' ? '#EE3333' : 'inherit';
    }

    private renderBody = () => {
        const { state, value } = this.props.model;
        if (state === "Waiting") {
            return <><WaitingIcon />Waiting for {this.props.waitingFor}</>;
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
                    Access denied
                </>
            );
        }
    };
}
