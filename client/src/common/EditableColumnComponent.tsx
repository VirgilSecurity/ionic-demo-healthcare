import React from 'react';
import { EditableColumnModel } from '../models/EditableColumnModel';
import ReplyForm from './ReplyForm';
import { observer } from 'mobx-react';

export interface IEditableColumnComponentProps {
    title: string;
    model: EditableColumnModel;
}

@observer
export default class EditableColumnComponent extends React.Component<IEditableColumnComponentProps> {
    render() {

        return (
            <div>
                <b>{this.props.title}</b>
                {this.renderBody()}
            </div>
        );
    }

    private renderBody = () => {
        const { state, value, send } = this.props.model;

        if (state === "Waiting") {
            return <p>waiting</p>;
        }
        if (state === "Editing") {
            return <ReplyForm value={value} onFormSubmit={send}></ReplyForm>
        }

        if (state === "Encrypting") {
            return <p>encrypting</p>
        }

        if (state === "Sending") {
            return <p>sending</p>
        }

        if (state === "Decrypting") {
            return <p>decrypting</p>
        }

        if (state === "Ready") {
            return <p>{value}</p>
        }
    }
}
