import { observable, action, reaction } from "mobx";
import { IonicAgent } from "./IonicAgent";

export class ReadonlyColumnModel {
    @observable state: "Waiting" | "Decrypting" | "Ready" | "Unable To Decrypt" = "Waiting";
    @observable value?: string;
    constructor(readonly sdk: IonicAgent, reactTo: () => string | undefined) {
        reaction(reactTo, (data) => {
            if (data) this.decrypt(data);
        })
    }

    @action
    decrypt(encryptedMessage: string) {
        this.state = "Decrypting";
        console.log('encryptedMessage', encryptedMessage);
        this.sdk.decryptText(encryptedMessage).then(message => {
            this.state = "Ready";
            this.value = message;
        }).catch((e) => {
            console.log(e)
            this.state = "Unable To Decrypt";
        });
    }

}
