import React from "react";
import { observer } from "mobx-react";
import DecryptionFieldComponent from "./components/DecryptionFieldComponent";
import EncryptionFieldComponent from "./components/EncryptionFieldComponent";
import { Button } from "react-bootstrap";
import { Store } from "./Store";
import { IStateResponse } from "./Connection";
import { ReadonlyColumnModel } from "./models/DecryptionField";
import { EditableColumnModel } from "./models/EncryptionField";

export interface IPhysicianDeviceProps {
    store: Store;
    data: IStateResponse;
}

export default class PhysicianDevice extends React.Component<IPhysicianDeviceProps> {
    render() {

        const medicalHistory = new ReadonlyColumnModel(
            this.props.store.physician,
            this.props.data.medical_history
        );

        const officeNotes = new EditableColumnModel(
            {
                sdk: this.props.store.physician,
                classification: "Medical History",
                onSubmit: this.props.store.sendVisitNotes
            },
            this.props.data.office_visit_notes
        );

        return (
            <div>
                <DecryptionFieldComponent
                    title="Medical history:"
                    model={medicalHistory}
                />
                <EncryptionFieldComponent
                    style={{ marginBottom: 20 }}
                    title="Office visit notes:"
                    model={officeNotes}
                />
                {/*
                <EditableColumnComponent
                    title="Prescription:"
                    model={physicianModel.prescription}
                />
                <ReadonlyColumnComponent
                    title="Insurer reply:"
                    model={physicianModel.insurerReply}
                /> */}
            </div>
        );
    }
}
