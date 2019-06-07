import React from "react";
import EditableColumnComponent from "./components/EditableColumnComponent";
import { PatientModel } from "./models/PatientModel";
import ReadonlyColumnComponent from "./components/ReadonlyColumnComponent";
import { observer } from "mobx-react";

export interface IPatientDeviceProps {
    patientModel: PatientModel;
}



@observer
export default class PatientDevice extends React.Component<IPatientDeviceProps> {
    render() {
        return (
            <div>
                <EditableColumnComponent
                    title="Medical history:"
                    model={this.props.patientModel.medicalHistory}
                />
                <ReadonlyColumnComponent
                    style={{ marginBottom: 20 }}
                    title="Office visit notes:"
                    model={this.props.patientModel.officeNotes}
                />
                <ReadonlyColumnComponent
                    title="Insurer reply:"
                    model={this.props.patientModel.insurerReply}
                />
            </div>
        );
    }
}
