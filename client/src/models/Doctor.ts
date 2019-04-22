import { Store } from "../Store";
import { computed } from "mobx";
import { EditableColumnModel } from "./EditableColumnModel";
import { ReadonlyColumnModel } from "./ReadonlyColumnModel";

export class Doctor {

    @computed get medicalHistory () {
        return new ReadonlyColumnModel(this.store.sdkMock, this.store.state.medical_history);
    }

    // @computed get officeNotes () {
    //     const model = new EditableColumnModel(this.store.sdkMock, this.store.sendVisitNotes);
    //     console.log('this.medicalHistory.state', this.medicalHistory.state);
    //     if (this.medicalHistory.state === "Ready") model.activate(this.store.state.office_visit_notes);
    //     return model;
    // }

    constructor(readonly store: Store) {

    }

}
