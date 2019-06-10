import { IonicAgent } from "./IonicAgent";
import { Connection, IStateResponse } from "../Connection";
import { observable, action, computed } from "mobx";
import { Store, Device } from "../Store";

export class DataStore {
    @observable state: IStateResponse | null = null;

    @computed get model() {
        if (!this.state) return null;
    }

    @computed get isActive() {
        return this.store.activeDevice === this.device;
    }

    constructor(private store: Store, private sdk: IonicAgent, private device: Device) {}

    @action
    activate = () => {
        this.state = null;
        Promise.all([this.store.connection.fetchState(), this.sdk.loadProfile()]).then(
            ([state]) => {
                this.state = state;
            }
        );
    };

    @action
    setActive = () => {
        this.store.setActiveDevice(this.device);
        this.activate();
    };
}
