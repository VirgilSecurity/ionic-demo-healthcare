import React from "react";
import EditableColumnComponent from "./components/EditableColumnComponent";
import { PatientModel } from "./models/PatientModel";
import ReadonlyColumnComponent from "./components/ReadonlyColumnComponent";
import { observer } from "mobx-react";
import { Button } from "react-bootstrap";

export interface IPatientDeviceProps {
    patientModel: PatientModel;
}

@observer
export default class PatientDevice extends React.Component<IPatientDeviceProps> {
    render() {
        const { patientModel } = this.props;

        if (!patientModel.device.isActive) {
            return (
                <div
                    style={{
                        display: "flex",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Button size="lg" onClick={patientModel.device.setActive}>
                        Activate
                    </Button>
                </div>
            );
        }
        return (
            <div>
                <EditableColumnComponent
                    title="Medical history:"
                    model={patientModel.medicalHistory}
                />
                <ReadonlyColumnComponent
                    style={{ marginBottom: 20 }}
                    title="Office visit notes:"
                    model={patientModel.officeNotes}
                />
                <ReadonlyColumnComponent title="Insurer reply:" model={patientModel.insurerReply} />
            </div>
        );
    }
}
