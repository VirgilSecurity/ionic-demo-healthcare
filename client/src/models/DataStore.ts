import { IonicAgent } from "./IonicAgent";
import { IStateResponse } from "../Connection";
import { observable, action, computed } from "mobx";
import { Store, Device } from "../Store";

export class DataStore {
    @observable state: IStateResponse | null = null;

    @computed get isActive() {
        return this.store.activeDevice === this.device;
    }

    constructor(private store: Store, public sdk: IonicAgent, private device: Device) {}

    @action
    activate = () => {
        this.state = null;

        Promise.all([this.store.connection.fetchState(), this.sdk.loadProfile()]).then(
            ([state]) => (this.state = state)
        );
    };

    @action
    setActive = () => {
        this.store.setActiveDevice(this.device);
        this.activate();
    };

    @action.bound
    sendMedicalHistory(value: string) {
        return this.store.connection.updateState({ medical_history: value }).then(() => {
            if (this.state) this.state.medical_history = value;
        });
    }

    @action.bound
    sendVisitNotes(value: string) {
        return this.store.connection.updateState({ office_visit_notes: value }).then(() => {
            if (this.state) this.state.office_visit_notes = value;
        });
    }

    @action.bound
    sendPrescription = (value: string) => {
        return this.store.connection.updateState({ prescription: value }).then(() => {
            if (this.state) this.state.prescription = value;
        });
    };

    @action.bound
    sendInsurerReply = (value: string) => {
        return this.store.connection.updateState({ insurer_reply: value }).then(() => {
            if (this.state) this.state.insurer_reply = value;
        });
    };
}
