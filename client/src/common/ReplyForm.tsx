import React, { useState } from "react";
import FormField, { IFormField } from "./FormField";
import { Form, Button, Spinner } from "react-bootstrap";
import { observer } from "mobx-react";
import { observable, action, toJS } from "mobx";

export interface IReplyFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    value?: string;
    onFormSubmit(value: string): Promise<any>;
}

@observer
export default class ReplyForm extends React.Component<IReplyFormProps> {
    @observable isLoading = false;
    @observable isSubmitted = false;
    field = new FormField(this.props.value)

    constructor(props: IReplyFormProps) {
        super(props);
        if (props.value) this.isSubmitted = true;
    }

    @action
    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.isLoading = true;
        this.props
            .onFormSubmit(this.field.value)
            .then(() => {
                this.field.submit();
                this.isLoading = false;
                this.isSubmitted = true;
            })
            .catch(err => {
                this.field.invalidate(err);
                this.isLoading = false;
            });
    };

    render() {
        return this.isSubmitted ? this.field.value : this.renderForm();
    }

    renderForm = () => {
        const { title, value, onFormSubmit, ...props } = this.props;
        return (
            <Form {...props} onSubmit={this.handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        value={this.field.inputValue}
                        onChange={e => this.field.handleChange(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" disabled={this.isLoading}>
                    {this.isLoading ? "Loading" : "Submit"}
                </Button>
            </Form>
        );
    }
}
