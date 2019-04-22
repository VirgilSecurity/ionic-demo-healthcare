import { EditableColumnModel } from "./EditableColumnModel";
import { ReadonlyColumnModel } from "./ReadonlyColumnModel";
import { Store } from "../Store";

export class InsurerModel {
    officeNotes = new EditableColumnModel(this.store.doctor, this.store.sendVisitNotes, () => this.store.state.office_visit_notes, () => this.medicalHistory.state === "Ready");;
    medicalHistory = new ReadonlyColumnModel(this.store.doctor, () => this.store.state.medical_history);

    constructor(readonly store: Store) {
        this.officeNotes
    }
}
