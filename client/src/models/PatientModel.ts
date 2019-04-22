import { Store } from "../Store";
import { EditableColumnModel } from "./EditableColumnModel";
import { ReadonlyColumnModel } from "./ReadonlyColumnModel";

export class PatientModel {

    medicalHistory = new EditableColumnModel(this.store.patient, this.store.sendMedicalHistory, () => this.store.state.medical_history);
    officeNotes = new ReadonlyColumnModel(this.store.patient, () => this.store.state.office_visit_notes);

    constructor(readonly store: Store) {}

}
