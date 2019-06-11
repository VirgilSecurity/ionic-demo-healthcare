import React from "react";
import DecryptionFieldComponent from "./components/DecryptionFieldComponent";
import EncryptionFieldComponent from "./components/EncryptionFieldComponent";
import { DecryptionFieldModel } from "./models/DecryptionField";
import { EncryptionColumnModel } from "./models/EncryptionField";
import { IPatientDeviceProps } from "./PatientDevice";

export default class PhysicianDevice extends React.Component<IPatientDeviceProps> {
    render() {
        const medicalHistory = new DecryptionFieldModel(
            this.props.model.sdk,
            this.props.data.medical_history
        );

        const officeNotes = new EncryptionColumnModel(
            {
                sdk: this.props.model.sdk,
                classification: "Office Visit Notes",
                onSubmit: this.props.model.sendVisitNotes
            },
            this.props.data.office_visit_notes
        );

        const prescription = new EncryptionColumnModel(
            {
                sdk: this.props.model.sdk,
                classification: "Prescription Order",
                onSubmit: this.props.model.sendPrescription
            },
            this.props.data.prescription
        );

        const insurerReply = new DecryptionFieldModel(
            this.props.model.sdk,
            this.props.data.insurer_reply
        );

        return (
            <div style={{ width: "100%" }}>
                <DecryptionFieldComponent
                    title="Medical history:"
                    waitingFor="Patient reply"
                    model={medicalHistory}
                />
                <EncryptionFieldComponent
                    title="Office visit notes:"
                    waitingFor="user input"
                    model={officeNotes}
                />

                <EncryptionFieldComponent
                    title="Prescription:"
                    waitingFor="user input"
                    model={prescription}
                />
                <DecryptionFieldComponent
                    title="Insurer reply:"
                    waitingFor="Insurance reply"
                    model={insurerReply}
                />
            </div>
        );
    }
}
