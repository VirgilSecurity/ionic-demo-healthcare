import { EditableColumnModel } from "./EditableColumnModel";
import { ReadonlyColumnModel } from "./ReadonlyColumnModel";
import { Store } from "../Store";

export class InsurerModel {
    medicalHistory = new ReadonlyColumnModel({
        sdk: this.store.insurer,
        valueReaction: () => this.store.state.medical_history
    });
    officeNotes = new ReadonlyColumnModel({
        sdk: this.store.insurer,
        valueReaction: () => this.store.state.office_visit_notes
    });
    prescription = new ReadonlyColumnModel({
        sdk: this.store.insurer,
        valueReaction: () => this.store.state.prescription
    });

    insurerReply = new EditableColumnModel({
        sdk: this.store.insurer,
        encryptFor: "patient_physician_insurer",
        onSubmit: this.store.sendInsurerReply,
        valueReaction: () => this.store.state.insurer_reply,
        activateReaction: () => this.prescription.state === "Ready"
    });

    constructor(readonly store: Store) {}
}
