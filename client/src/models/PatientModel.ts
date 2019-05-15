import { Store } from "../Store";
import { EditableColumnModel } from "./EditableColumnModel";
import { ReadonlyColumnModel } from "./ReadonlyColumnModel";

export class PatientModel {
    medicalHistory = new EditableColumnModel({
        sdk: this.store.patient,
        classification:  "Medical History",
        onSubmit: this.store.sendMedicalHistory,
        valueReaction: () => this.store.state.medical_history,
        activateReaction: () => this.store.state
    });

    officeNotes = new ReadonlyColumnModel({
        sdk: this.store.patient,
        valueReaction: () => this.store.state.office_visit_notes
    });

    prescription = new ReadonlyColumnModel({
        sdk: this.store.patient,
        valueReaction: () => this.store.state.prescription
    });

    insurerReply = new ReadonlyColumnModel({
        sdk: this.store.patient,
        valueReaction: () => this.store.state.insurer_reply
    });

    constructor(readonly store: Store) {
    }
}
