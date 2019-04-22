import { Store } from "../Store";
import { computed } from "mobx";
import { EditableColumnModel } from "./EditableColumnModel";
import { ReadonlyColumnModel } from "./ReadonlyColumnModel";

export class Patient {

    @computed get medicalHistory () {
        const model = new EditableColumnModel(this.store.sdkMock, this.store.sendMedicalHistory, () => this.store.state.medical_history);
        return model;
    }

    @computed get officeNotes () {
        return new ReadonlyColumnModel(this.store.sdkMock, this.store.state.office_visit_notes);
    }

    constructor(readonly store: Store) {}


    sendMedical(message: string) {
        this.medicalHistory.encrypt(message).then(this.store.sendMedicalHistory);
    }
}
