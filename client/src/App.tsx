import React, { Component } from "react";
import { Store } from "./Store";
import { observer } from "mobx-react";
import { Container, Col, Row, ColProps, RowProps, Button } from "react-bootstrap";
import { asyncSequence } from "./utils";
import EditableColumnComponent from "./components/EditableColumnComponent";
import ReadonlyColumnComponent from "./components/ReadonlyColumnComponent";

const PatientCol: React.FC<ColProps & React.HTMLAttributes<HTMLDivElement>> = props => (
    <Col lg="3" style={{ backgroundColor: "rgba(255, 0, 0, 0.05)", padding: 20 }} {...props} />
);
const DoctorCol: React.FC<ColProps & React.HTMLAttributes<HTMLDivElement>> = props => (
    <Col lg="3" style={{ backgroundColor: "rgba(0, 255, 0, 0.05)", padding: 20 }} {...props} />
);
const InsurerCol: React.FC<ColProps & React.HTMLAttributes<HTMLDivElement>> = props => (
    <Col lg="3" style={{ backgroundColor: "rgba(0, 0, 255, 0.05)", padding: 20 }} {...props} />
);

const InfoCol: React.FC<ColProps> = props => (
    <Col lg="3" xs style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", padding: 20 }} {...props} />
);

const CustomRow: React.FC<RowProps & React.HTMLAttributes<HTMLDivElement>> = props => (
    <Row style={{ borderBottom: "2px solid white" }} {...props} />
);

@observer
class App extends Component {
    store = new Store();

    componentDidMount() {
        asyncSequence([
            this.store.patient.loadProfile.bind(this.store.patient),
            this.store.doctor.loadProfile.bind(this.store.doctor),
            this.store.insurer.loadProfile.bind(this.store.insurer)
        ]).then(this.store.loadData);
    }

    render() {
        return (
            <Container fluid>
                <CustomRow>
                    <InfoCol>
                        <Button variant="outline-danger" onClick={this.store.reset}>reset</Button>
                    </InfoCol>
                    <PatientCol>
                        <h3>Patient Device</h3>
                    </PatientCol>
                    <DoctorCol>
                        <h3>Doctor Device</h3>
                    </DoctorCol>
                    <InsurerCol>
                        <h3>Insurer Device</h3>
                    </InsurerCol>
                </CustomRow>
                <CustomRow>
                    <InfoCol>
                        <h3>Patient Info</h3>
                    </InfoCol>
                    <PatientCol>
                        <EditableColumnComponent
                            title="Medical history:"
                            model={this.store.patientModel.medicalHistory}
                        />
                    </PatientCol>
                    <DoctorCol>
                        <ReadonlyColumnComponent
                            title="Medical history:"
                            model={this.store.doctorModel.medicalHistory}
                        />
                    </DoctorCol>
                    <InsurerCol>
                        <ReadonlyColumnComponent
                            title="Medical history:"
                            model={this.store.insurerModel.medicalHistory}
                        />
                    </InsurerCol>
                </CustomRow>
                <CustomRow>
                    <InfoCol>
                        <h3>Doctor Info</h3>
                    </InfoCol>
                    <PatientCol>
                        <ReadonlyColumnComponent
                            style={{ marginBottom: 20 }}
                            title="Office visit notes:"
                            model={this.store.patientModel.officeNotes}
                        />
                        <ReadonlyColumnComponent
                            title="Prescription:"
                            model={this.store.patientModel.prescription}
                        />
                    </PatientCol>
                    <DoctorCol>
                        <EditableColumnComponent
                            style={{ marginBottom: 20 }}
                            title="Office visit notes:"
                            model={this.store.doctorModel.officeNotes}
                        />
                        <EditableColumnComponent
                            title="Prescription:"
                            model={this.store.doctorModel.prescription}
                        />
                    </DoctorCol>
                    <InsurerCol>
                        <ReadonlyColumnComponent
                            style={{ marginBottom: 20 }}
                            title="Office visit notes:"
                            model={this.store.insurerModel.officeNotes}
                        />
                        <ReadonlyColumnComponent
                            title="Prescription:"
                            model={this.store.insurerModel.prescription}
                        />
                    </InsurerCol>
                </CustomRow>
                <CustomRow>
                    <InfoCol>
                        <h3>Insurer Info</h3>
                    </InfoCol>
                    <PatientCol>
                        <ReadonlyColumnComponent
                            title="Insurer reply:"
                            model={this.store.patientModel.insurerReply}
                        />
                    </PatientCol>
                    <DoctorCol>
                        <ReadonlyColumnComponent
                            title="Insurer reply:"
                            model={this.store.doctorModel.insurerReply}
                        />
                    </DoctorCol>
                    <InsurerCol>
                        <EditableColumnComponent
                            title="Insurer reply:"
                            model={this.store.insurerModel.insurerReply}
                        />
                    </InsurerCol>
                </CustomRow>
            </Container>
        );
    }
}

export default App;
