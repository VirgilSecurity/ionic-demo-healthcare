import { Store } from "../Store";
import { EditableColumnModel } from "./EditableColumnModel";
import { ReadonlyColumnModel } from "./ReadonlyColumnModel";

export class DoctorModel {

    medicalHistory = new ReadonlyColumnModel(this.store.doctor, () => this.store.state.medical_history);
    officeNotes = new EditableColumnModel(this.store.doctor, this.store.sendVisitNotes, () => this.store.state.office_visit_notes, () => this.medicalHistory.state === "Ready");;

    constructor(readonly store: Store) {
    }
}
