import React from "react";
// // import { InsurerModel } from "./models/InsurerModel";
import DecryptionFieldComponent from "./components/DecryptionFieldComponent";
import { DecryptionFieldModel } from "./models/DecryptionField";
import { IPatientDeviceProps } from "./PatientDevice";
import EncryptionFieldComponent from "./components/EncryptionFieldComponent";
import { EncryptionColumnModel } from "./models/EncryptionField";

export default class InsurerDevice extends React.Component<IPatientDeviceProps> {
    render() {
        const medicalHistory = new DecryptionFieldModel(
            this.props.model.sdk,
            this.props.data.medical_history
        );

        const officeVisitNotes = new DecryptionFieldModel(
            this.props.model.sdk,
            this.props.data.office_visit_notes
        );

        const prescription = new DecryptionFieldModel(
            this.props.model.sdk,
            this.props.data.prescription
        );

        const insurerReply = new EncryptionColumnModel(
            {
                sdk: this.props.model.sdk,
                classification: "Insurance Reply",
                onSubmit: this.props.model.sendInsurerReply
            },
            this.props.data.insurer_reply
        );

        return (
            <div style={{ width: "100%" }}>
                <DecryptionFieldComponent
                    title="Medical history:"
                    waitingFor="Patient reply"
                    model={medicalHistory}
                />
                <DecryptionFieldComponent
                    title="Office Visit Notes:"
                    waitingFor="Physician reply"
                    model={officeVisitNotes}
                />
                <DecryptionFieldComponent
                    title="Prescription:"
                    waitingFor="Physician reply"
                    model={prescription}
                />
                <EncryptionFieldComponent
                    title="Insurance Reply:"
                    waitingFor="user input"
                    model={insurerReply}
                />
            </div>
        );
    }
}
