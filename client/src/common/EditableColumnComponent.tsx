import React from 'react';
import { EditableColumnModel } from '../models/EditableColumnModel';
import ReplyForm from './ReplyForm';
import { observer } from 'mobx-react';
import { WaitingIcon, SpinnerIcon, EditIcon } from './Icons';

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
            return <p><WaitingIcon /> Waiting for data</p>;
        }
        if (state === "Editing") {
            return <ReplyForm value={value} onFormSubmit={send}></ReplyForm>
        }

        if (state === "Encrypting") {
            return <p><SpinnerIcon /> Encrypting</p>
        }

        if (state === "Sending") {
            return <p><SpinnerIcon /> Sending</p>
        }

        if (state === "Decrypting") {
            return <p><SpinnerIcon /> Decrypting</p>
        }

        if (state === "Ready") {
            return <p><EditIcon />{value}</p>
        }
    }
}
