import { SdkMock } from "../Store";
import { observable, action } from "mobx";

export class ReadonlyColumnModel {
    @observable state: "Waiting" | "Decrypting" | "Ready" | "Unable To Decrypt" = "Waiting";

    constructor(readonly sdk: SdkMock, public value?: string) {
        if (value) this.decrypt(value);
    }

    @action
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
