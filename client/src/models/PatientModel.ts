import { Store, Device } from "../Store";
import { EditableColumnModel } from "./EditableColumnModel";
import { ReadonlyColumnModel } from "./ReadonlyColumnModel";
import { computed, action, observable } from "mobx";
import { IonicAgent } from "./IonicAgent";
import { when } from "mobx";
import { DeviceInfo } from "./DeviceInfo";


export class PatientModel {
    device = new DeviceInfo(this.store);

    patientSdk = new IonicAgent({
        username: "test_patient",
        password: "password123",
        fetchIonicAssertion: () =>
            this.store.connection.registerUser({
                email: "test_patient@healthcaredemo.com",
                groupName: "patients",
                firstName: "Test",
                lastName: "Patient"
            })
    });

    constructor(readonly store: Store) {
        this.patientSdk.loadProfile().then(this.device.onProfileLoaded);

        when(() => this.device.isReady, this.medicalHistory.startEditing);
        when(
            () => this.device.isReadyToDecryptMedicalInfo,
            () => {
                this.medicalHistory.decrypt(this.store.state.medical_history!);
            }
        );
    }

    medicalHistory = new EditableColumnModel({
        sdk: this.patientSdk,
        classification: "Medical History",
        onSubmit: this.store.sendMedicalHistory,
        valueReaction: () => "any",
        activateReaction: () => "any"
    });

    officeNotes = new ReadonlyColumnModel({
        sdk: this.patientSdk,
        valueReaction: () => this.store.state.office_visit_notes
    });

    prescription = new ReadonlyColumnModel({
        sdk: this.patientSdk,
        valueReaction: () => this.store.state.prescription
    });

    insurerReply = new ReadonlyColumnModel({
        sdk: this.patientSdk,
        valueReaction: () => this.store.state.insurer_reply
    });
}
