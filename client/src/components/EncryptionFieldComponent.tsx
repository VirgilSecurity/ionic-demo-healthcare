import React, { CSSProperties } from "react";
import { EditableColumnModel } from "../models/EncryptionField";
import ReplyForm from "./ReplyForm";
import { observer } from "mobx-react";
import { WaitingIcon, SpinnerIcon, EditIcon } from "./Icons";

export interface IEncryptionFieldComponentProps {
    title: string;
    model: EditableColumnModel;
    style?: CSSProperties;
}

@observer
export default class EncryptionFieldComponent extends React.Component<
    IEncryptionFieldComponentProps
> {
    render() {
        return (
            <div style={this.props.style}>
                <b>{this.props.title}</b>
                <div style={{ overflow: "hidden", wordBreak: "break-all" }}>
                    {this.renderBody()}
                </div>
            </div>
        );
    }

    private renderBody = () => {
        const { state, value, send } = this.props.model;

        if (state === "Waiting") {
            return (
                <>
                    <WaitingIcon /> Waiting for data
                </>
            );
        }
        if (state === "Editing") {
            return <ReplyForm value={value} onFormSubmit={send} />;
        }

        if (state === "Encrypting") {
            return (
                <>
                    <SpinnerIcon /> Encrypting
                </>
            );
        }

        if (state === "Sending") {
            return (
                <>
                    <SpinnerIcon /> Sending
                </>
            );
        }

        if (state === "Decrypting") {
            return (
                <>
                    <SpinnerIcon /> Decrypting
                </>
            );
        }

        if (state === "Ready") {
            return (
                <>
                    <EditIcon />
                    {value}
                </>
            );
        }
    };
}
