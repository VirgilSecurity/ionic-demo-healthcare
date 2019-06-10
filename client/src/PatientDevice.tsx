import React from "react";
import EncryptionFieldComponent from "./components/EncryptionFieldComponent";
import DecryptionFieldComponent from "./components/DecryptionFieldComponent";
import { IStateResponse } from "./Connection";
import { EditableColumnModel } from "./models/EncryptionField";
import { Store } from "./Store";
import { ReadonlyColumnModel } from "./models/DecryptionField";

export interface IPatientDeviceProps {
    store: Store;
    data: IStateResponse;
}

export default class PatientDevice extends React.Component<IPatientDeviceProps> {
    render() {
        const { data } = this.props;
        const medicalHistory = new EditableColumnModel(
            {
                sdk: this.props.store.patientSdk,
                classification: "Medical History",
                onSubmit: this.props.store.sendMedicalHistory
            },
            data.medical_history
        );

        const officeNotes = new ReadonlyColumnModel(
            this.props.store.patientSdk,
            data.office_visit_notes
        );

        return (
            <div>
                <EncryptionFieldComponent title="Medical history:" model={medicalHistory} />
                {this.renderSwitchDevice(
                    data.medical_history,
                    !data.office_visit_notes,
                    "Physician Device"
                )}
                <DecryptionFieldComponent
                    style={{ marginBottom: 20 }}
                    title="Office visit notes:"
                    model={officeNotes}
                />
                {/*
                <ReadonlyColumnComponent
                    style={{ marginBottom: 20 }}
                    title="Office visit notes:"
                    model={data.data}
                />
                <ReadonlyColumnComponent title="Insurer reply:" model={data.insurerReply} /> */}
            </div>
        );
    }

    renderSwitchDevice(condition1: any, condition2: any, device: string) {
        if (condition1 && condition2) {
            return <p>Login to {device} to continue</p>;
        }
        return null;
    }
}
