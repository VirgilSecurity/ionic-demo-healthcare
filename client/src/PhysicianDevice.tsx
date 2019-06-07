import React from "react";
import { observer } from "mobx-react";
import { PhysicianModel } from "./models/PhysicianModel";
import ReadonlyColumnComponent from "./components/ReadonlyColumnComponent";
import EditableColumnComponent from "./components/EditableColumnComponent";
import { Col } from "react-bootstrap";

export interface IPhysicianDeviceProps {
    physicianModel: PhysicianModel;
}

@observer
export default class PhysicianDevice extends React.Component<IPhysicianDeviceProps> {
    render() {
        return (
            <Col lg="3" style={{ backgroundColor: "rgba(0, 255, 0, 0.05)", padding: 20 }}>
                <h2>PhysicianDevice</h2>
                <ReadonlyColumnComponent
                    title="Medical history:"
                    model={this.props.physicianModel.medicalHistory}
                />
                <EditableColumnComponent
                    style={{ marginBottom: 20 }}
                    title="Office visit notes:"
                    model={this.props.physicianModel.officeNotes}
                />
                <EditableColumnComponent
                    title="Prescription:"
                    model={this.props.physicianModel.prescription}
                />
                <ReadonlyColumnComponent
                    title="Insurer reply:"
                    model={this.props.physicianModel.insurerReply}
                />
            </Col>
        );
    }
}
