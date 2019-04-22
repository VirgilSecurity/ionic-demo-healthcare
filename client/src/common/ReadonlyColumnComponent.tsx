import React from "react";
import { ReadonlyColumnModel } from "../models/ReadonlyColumnModel";
import { observer } from "mobx-react";
import { Lock, CloudDownload, WaitingIcon } from "./Icons";


export interface IReadonlyColumnComponentProps {
    title: string;
    model: ReadonlyColumnModel;
}

@observer
export default class ReadonlyColumnComponent extends React.Component<
    IReadonlyColumnComponentProps
> {
    render() {
        return (
            <div>
                <b>{this.props.title}</b>
                {this.renderBody()}
            </div>
        );
    }

    private renderBody = () => {
        const { state, value } = this.props.model;
        if (state === "Waiting") {
            return <p><WaitingIcon />Waiting for user data</p>;
        }

        if (state === "Decrypting") {
            return <p>decrypting</p>;
        }

        if (state === "Ready") {
            return <p><CloudDownload />{value}</p>;
        }

        if (state === "Unable To Decrypt") {
            return (
                <p>
                    <Lock />
                    Failed to decrypt
                </p>
            );
        }
    };
}
