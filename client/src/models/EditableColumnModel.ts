
import { SdkMock } from "../Store";
import { observable, action, reaction } from "mobx";

export class EditableColumnModel {
    @observable value?: string;
    @observable state: "Waiting" | "Editing" | "Encrypting" | "Sending" | "Decrypting" | "Ready" | "Unable To Decrypt" = "Waiting";

    constructor(readonly sdk: SdkMock, private finish: (message: string) => Promise<void>, reactTo: () => string | undefined) {
        reaction<string | undefined>(reactTo, data => this.activate(data));
    }

    @action.bound
    activate(value?: string) {
        value ? this.decrypt(value) : this.startEditing();
    }

    @action.bound
    startEditing() {
        this.state = "Editing";
    }

    @action.bound
    encrypt(message: string) {
        this.state = "Encrypting";

        return this.sdk.encryptText(message).then(encryptedMessage => {
            this.state = "Sending";
            this.value = encryptedMessage;
            return encryptedMessage;
        });
    }

    @action.bound
    send(encryptedMessage: string) {
        return this.finish(encryptedMessage).then(() => {
            this.state = "Ready";
        })
    }

    @action.bound
    decrypt(encryptedMessage: string) {
        this.state = "Decrypting";

        this.sdk.decryptText(encryptedMessage).then(message => {
            this.state = "Ready";
            this.value = message;
        }).catch(() => {
            this.state = "Unable To Decrypt";
        });
    }

}
