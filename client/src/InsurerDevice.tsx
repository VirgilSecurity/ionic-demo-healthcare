import React from "react";
import { InsurerModel } from "./models/InsurerModel";
import ReadonlyColumnComponent from "./components/ReadonlyColumnComponent";
import EditableColumnComponent from "./components/EditableColumnComponent";
import { Col } from "react-bootstrap";

export interface IInsurerDeviceProps {
    insurerModel: InsurerModel;
}

export default class InsurerDevice extends React.Component<IInsurerDeviceProps> {
    render() {
        return (
            <Col lg="3" style={{ backgroundColor: "rgba(0, 0, 255, 0.05)", padding: 20 }}>
                <h2>Insurer Device</h2>
                <ReadonlyColumnComponent
                    title="Medical history:"
                    model={this.props.insurerModel.medicalHistory}
                />
                <ReadonlyColumnComponent
                    style={{ marginBottom: 20 }}
                    title="Office visit notes:"
                    model={this.props.insurerModel.officeNotes}
                />
                <ReadonlyColumnComponent
                    title="Prescription:"
                    model={this.props.insurerModel.prescription}
                />
                <EditableColumnComponent
                    title="Insurer reply:"
                    model={this.props.insurerModel.insurerReply}
                />
            </Col>
        );
    }
}
