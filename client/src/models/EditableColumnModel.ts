import { observable, action, reaction } from "mobx";
import { IonicAgent } from "./IonicAgent";

export class EditableColumnModel {
    @observable value?: string;
    @observable state: "Waiting" | "Editing" | "Encrypting" | "Sending" | "Decrypting" | "Ready" | "Unable To Decrypt" = "Waiting";

    constructor(readonly sdk: IonicAgent, private finish: (message: string) => Promise<string>, reactTo: () => string | undefined, activate?: () => any) {
        reaction<string | undefined>(reactTo, data => this.activate(data));
        if (activate) reaction(activate, () => this.startEditing());
        this.finish = this.finish.bind(this);
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
        return this.sdk.encryptText(message, 'patient_physician').then(encryptedMessage => {
            this.state = "Sending";
            return encryptedMessage;
        }).catch(console.log);
    }

    @action.bound
    send(message: string) {
        return this.encrypt(message).then(encryptedMessage => this.finish(encryptedMessage).then((msg) => {
            this.state = "Ready";
            this.value = message;
        }))
    }

    @action.bound
    decrypt(encryptedMessage: string) {
        if (this.state !== "Waiting") return;
        this.state = "Decrypting";

        this.sdk.decryptText(encryptedMessage).then(message => {
            this.state = "Ready";
            this.value = message;
        }).catch(() => {
            this.state = "Unable To Decrypt";
        });
    }

}
