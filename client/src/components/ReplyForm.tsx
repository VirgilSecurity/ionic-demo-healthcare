import React from "react";
import FormField from "../models/FormField";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

export interface IReplyFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    value?: string;
    onFormSubmit(value: string): Promise<any>;
}

@observer
export default class ReplyForm extends React.Component<IReplyFormProps> {
    @observable isLoading = false;
    field = new FormField(this.props.value)

    @action
    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.isLoading = true;
        this.props
            .onFormSubmit(this.field.value)
            .then(() => {
                this.field.submit();
                this.isLoading = false;
            })
            .catch(err => {
                this.field.invalidate(err);
                this.isLoading = false;
            });
    };


    render(){
        const { title, value, onFormSubmit, ...props } = this.props;
        return (
            <Form {...props} onSubmit={this.handleSubmit}>
                <InputGroup>
                    <FormControl
                        required
                        value={this.field.inputValue}
                        onChange={e => this.field.handleChange(e.target.value)}
                    />
                    <InputGroup.Append>
                        <Button type="submit" disabled={this.isLoading}>
                            {this.isLoading ? "Loading" : "Submit"}
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
        );
    }
}
