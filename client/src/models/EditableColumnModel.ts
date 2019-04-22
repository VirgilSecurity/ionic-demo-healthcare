import { observable, action, reaction } from "mobx";
import { IonicAgent } from "./IonicAgent";

export interface IEditableColumnModelOptions {
    sdk: IonicAgent;
    encryptFor: string;
    onSubmit: (message: string) => Promise<string>;
    valueReaction: () => string | undefined;
    activateReaction?: () => any;
}

export class EditableColumnModel {
    @observable value?: string;
    @observable state:
        | "Waiting"
        | "Editing"
        | "Encrypting"
        | "Sending"
        | "Decrypting"
        | "Ready"
        | "Unable To Decrypt" = "Waiting";

    private sdk: IonicAgent;
    private encryptFor: string;
    private onSubmit: (message: string) => Promise<string>;


    constructor(options: IEditableColumnModelOptions) {
        const { sdk, encryptFor, onSubmit, valueReaction, activateReaction } = options;
        this.sdk = sdk;
        this.onSubmit = onSubmit;
        this.encryptFor = encryptFor;
        reaction(valueReaction, data => this.activate(data));
        if (activateReaction) reaction(activateReaction, this.startEditing);
    }

    @action.bound
    activate(value?: string) {
        if (this.state !== "Waiting") return;
        value ? this.decrypt(value) : this.startEditing();
    }

    @action.bound
    startEditing() {
        if (this.state !== "Waiting") return;
        this.state = "Editing";
    }

    @action.bound
    encrypt(message: string) {
        this.state = "Encrypting";
        return this.sdk
            .encryptText(message, this.encryptFor)
            .then(encryptedMessage => {
                this.state = "Sending";
                return encryptedMessage;
            })
            .catch(e => console.log('err', e));
    }

    @action.bound
    send(message: string) {
        return this.encrypt(message).then(encryptedMessage =>
            this.onSubmit(encryptedMessage).then(msg => {
                this.state = "Ready";
                this.value = message;
            })
        );
    }

    @action.bound
    decrypt(encryptedMessage: string) {
        if (this.state !== "Waiting") return;
        this.state = "Decrypting";

        this.sdk
            .decryptText(encryptedMessage)
            .then(message => {
                this.state = "Ready";
                this.value = message;
            })
            .catch(() => {
                this.state = "Unable To Decrypt";
            });
    }
}
