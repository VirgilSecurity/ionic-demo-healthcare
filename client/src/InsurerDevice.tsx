import React from "react";
// // import { InsurerModel } from "./models/InsurerModel";
import DecryptionFieldComponent from "./components/DecryptionFieldComponent";
import { Store } from "./Store";
import { IStateResponse } from "./Connection";
import { ReadonlyColumnModel } from "./models/DecryptionField";
import EncryptionFieldComponent from "./components/EncryptionFieldComponent";
import { EditableColumnModel } from "./models/EncryptionField";
// import EditableColumnComponent from "./components/EditableColumnComponent";
// import { Col } from "react-bootstrap";

export interface IInsurerDeviceProps {
    store: Store;
    data: IStateResponse;
}

export default class InsurerDevice extends React.Component<IInsurerDeviceProps> {
    render() {
        const medicalHistory = new ReadonlyColumnModel(
            this.props.store.insurer,
            this.props.data.medical_history
        );

        const officeVisitNotes = new ReadonlyColumnModel(
            this.props.store.insurer,
            this.props.data.office_visit_notes
        );

        return (
            <div>
                <DecryptionFieldComponent title="Medical history:" model={medicalHistory} />
                <DecryptionFieldComponent title="Office Visit Notes:" model={officeVisitNotes} />
            </div>
        );
    }
}
