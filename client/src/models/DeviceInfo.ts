import { action, computed, observable } from "mobx";
import { Store, Device } from "../Store";

export class DeviceInfo {
    @observable isProfileLoaded = false;

    @computed get isActive() {
        return this.store.activeDevice === Device.Patient;
    }

    @computed get isReady() {
        return this.isActive && this.isProfileLoaded;
    }

    @computed get isReadyToDecryptMedicalInfo() {
        return this.isReady && Boolean(this.store.state.medical_history);
    }

    constructor(readonly store: Store) {}

    setActive = () => {
        this.store.setActiveDevice(Device.Patient);
    };

    @action.bound
    onProfileLoaded() {
        this.isProfileLoaded = true;
    }
}
