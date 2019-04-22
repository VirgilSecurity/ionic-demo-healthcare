import React from 'react';
import { ReadonlyColumnModel } from '../models/ReadonlyColumnModel';
import { observer } from 'mobx-react';

export interface IReadonlyColumnComponentProps {
    title: string;
    model: ReadonlyColumnModel;
}

@observer
export default class ReadonlyColumnComponent extends React.Component<IReadonlyColumnComponentProps> {
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
            return <p>waiting</p>;
        }

        if (state === "Decrypting") {
            return <p>decrypting</p>
        }

        if (state === "Ready") {
            return <p>{value}</p>
        }
    }
}
