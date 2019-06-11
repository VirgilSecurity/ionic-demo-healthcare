import React from "react";
import EncryptionFieldComponent from "./components/EncryptionFieldComponent";
import DecryptionFieldComponent from "./components/DecryptionFieldComponent";
import { IStateResponse } from "./Connection";
import { EncryptionColumnModel } from "./models/EncryptionField";
import { DecryptionFieldModel } from "./models/DecryptionField";
import { DataStore } from "./models/DataStore";

export interface IPatientDeviceProps {
    model: DataStore;
    data: IStateResponse;
}

export default class PatientDevice extends React.Component<IPatientDeviceProps> {
    render() {
        const { data } = this.props;
        const medicalHistory = new EncryptionColumnModel(
            {
                sdk: this.props.model.sdk,
                classification: "Medical History",
                onSubmit: this.props.model.sendMedicalHistory
            },
            data.medical_history
        );

        const officeNotes = new DecryptionFieldModel(this.props.model.sdk, data.office_visit_notes);

        const prescription = new DecryptionFieldModel(this.props.model.sdk, data.prescription);

        const insurerReply = new DecryptionFieldModel(this.props.model.sdk, data.insurer_reply);

        return (
            <div style={{ width: "100%" }}>
                <EncryptionFieldComponent
                    title="Medical history:"
                    waitingFor="user input"
                    model={medicalHistory}
                />
                <DecryptionFieldComponent
                    title="Office visit notes:"
                    waitingFor="Physician reply"
                    model={officeNotes}
                />

                <DecryptionFieldComponent
                    title="Prescription notes:"
                    waitingFor="Physician reply"
                    model={prescription}
                />
                <DecryptionFieldComponent
                    title="Insurance reply:"
                    waitingFor="Insurance reply"
                    model={insurerReply}
                />
            </div>
        );
    }
}
