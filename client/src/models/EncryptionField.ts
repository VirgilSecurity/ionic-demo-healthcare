import { observable, action } from "mobx";
import { IonicAgent, DataClassification } from "./IonicAgent";

export interface IDecryptionColumnModelOptions {
    sdk: IonicAgent;
    classification: DataClassification;
    onSubmit: (message: string) => Promise<void>;
}

type EditableColumnStates =
    | "Waiting"
    | "Editing"
    | "Encrypting"
    | "Sending"
    | "Decrypting"
    | "Ready"
    | "Unable To Decrypt";

export class EncryptionColumnModel {
    @observable value?: string;
    @observable state: EditableColumnStates = "Waiting";

    private sdk: IonicAgent;
    private classification: DataClassification;
    private onSubmit: (message: string) => Promise<void>;

    constructor(options: IDecryptionColumnModelOptions, data?: string) {
        const { sdk, classification, onSubmit } = options;
        this.sdk = sdk;
        this.onSubmit = onSubmit;
        this.classification = classification;
        data ? this.decrypt(data) : this.startEditing();
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
            .encryptText(message, this.classification)
            .then(encryptedMessage => {
                this.state = "Sending";
                return encryptedMessage;
            })
            .catch(e => console.log("err", e));
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
