import React, { Component } from "react";
import { Store } from "./Store";
import { observer } from "mobx-react";
import { Container, Col, Row, ColProps, RowProps } from "react-bootstrap";
import ReplyForm from "./common/ReplyForm";
import { ConditionalText } from "./common/ConditionalText";
import { FaLock, FaFileMedicalAlt } from "react-icons/fa";
import { asyncSequence } from './utils';
import EditableColumnComponent from "./common/EditableColumnComponent";
import ReadonlyColumnComponent from "./common/ReadonlyColumnComponent";

const PatientCol: React.FC<ColProps> = props => (
    <Col lg="3" style={{ backgroundColor: "rgba(255, 0, 0, 0.05)", padding: 20 }} {...props} />
);
const DoctorCol: React.FC<ColProps> = props => (
    <Col lg="3" style={{ backgroundColor: "rgba(0, 255, 0, 0.05)", padding: 20 }} {...props} />
);
const InsurerCol: React.FC<ColProps> = props => (
    <Col lg="3" style={{ backgroundColor: "rgba(0, 0, 255, 0.05)", padding: 20 }} {...props} />
);

const InfoCol: React.FC<ColProps> = props => (
    <Col lg="2" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", padding: 20 }} {...props} />
);

const CustomRow: React.FC<RowProps & React.HTMLAttributes<HTMLDivElement>> = props => (
    <Row style={{ borderBottom: "2px solid white" }} {...props} />
);


@observer
class App extends Component {
    store = new Store();

    componentDidMount() {
        this.store.loadData();
        asyncSequence([
            this.store.patient.loadProfile.bind(this.store.patient),
            this.store.doctor.loadProfile.bind(this.store.doctor),
            this.store.insurer.loadProfile.bind(this.store.insurer)
        ]).then(() => {
            console.log('All profiles loaded');
            this.store.patient.encryptText('not for insurer', 'patient_physician')
            .then(ciphertext => {
                console.log('Patient encrypted: %s', ciphertext);

                this.store.doctor.decryptText(ciphertext)
                .then(text => console.log('Doctor decrypted: %s', text))
                .catch(err => console.error('Doctor could not decrypt: %o', err));

                this.store.insurer.decryptText(ciphertext)
                .then(text => console.log('Insurer decrypted: %s', text))
                .catch(err => console.error('Insurer could not decrypt: %o', err));
            })
        }).catch(err => {
            console.error('Error loading profiles: %o', err);
        });
    }

    render() {
        return (
            <Container>
                <CustomRow>
                    <PatientCol lg={{ span: 3, offset: 2 }}>
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
                        <EditableColumnComponent title="Medical history" model={this.store.patientModel.medicalHistory} />
                    </PatientCol>
                    <DoctorCol>
                        <ReadonlyColumnComponent title="Medical history" model={this.store.doctorModel.medicalHistory} />
                    </DoctorCol>
                    <InsurerCol>
                        <b>Medical History:</b>
                        <p>
                            <FaLock size="2em" />
                        </p>
                    </InsurerCol>
                </CustomRow>
                <CustomRow>
                    <InfoCol>
                        <h3>Doctor Info</h3>
                    </InfoCol>
                    <PatientCol>
                        <ConditionalText
                            title="Office Visit Notes:"
                            isReady={this.store.state.office_visit_notes}
                            content="waiting for doctor office visit notes"
                        >
                            {this.store.state.office_visit_notes}
                        </ConditionalText>
                        <ConditionalText
                            title="Prescription:"
                            isReady={this.store.state.prescription}
                            content="waiting for doctor prescription"
                        >
                            {this.store.state.prescription}
                        </ConditionalText>
                    </PatientCol>
                    <DoctorCol>
                        <ConditionalText
                            title="Office visit notes:"
                            isReady={Boolean(this.store.state.medical_history)}
                            content="waiting for patient response"
                        >
                            <ReplyForm
                                title="Office visit notes:"
                                onFormSubmit={this.store.sendVisitNotes}
                                value={this.store.state.office_visit_notes}
                                style={{ marginBottom: 20 }}
                            />
                        </ConditionalText>
                        <ConditionalText
                            title="Prescription:"
                            isReady={Boolean(this.store.state.medical_history)}
                            content="waiting for patient response"
                        >
                            <ReplyForm
                                onFormSubmit={this.store.sendPrescription}
                                value={this.store.state.prescription}
                            />
                        </ConditionalText>
                    </DoctorCol>
                    <InsurerCol>
                        <ConditionalText
                            title="Office visit notes"
                            isReady={Boolean(this.store.state.office_visit_notes)}
                            content="waiting for doctor office visit notes"
                        >
                            {this.store.state.office_visit_notes}
                        </ConditionalText>
                        <div>
                            <b>Prescription:</b>
                            <p>
                                <FaLock size="2em" />
                            </p>
                        </div>
                    </InsurerCol>
                </CustomRow>
                <CustomRow>
                    <InfoCol lg="2">
                        <h3>Insurer Info</h3>
                    </InfoCol>
                    <PatientCol>
                        <ConditionalText
                            title="Insurer Reply:"
                            isReady={this.store.state.insurer_reply}
                            content="wait for insurer reply"
                        >
                            {this.store.state.insurer_reply}
                        </ConditionalText>
                    </PatientCol>
                    <DoctorCol>
                        <ConditionalText
                            title="Insurer Reply:"
                            isReady={this.store.state.insurer_reply}
                            content="Wait for insurance reply response"
                        >
                            <p>{this.store.state.insurer_reply}</p>
                        </ConditionalText>
                    </DoctorCol>
                    <InsurerCol>
                        <ConditionalText
                            title="Insurer Reply:"
                            isReady={this.store.state.office_visit_notes}
                            content="Wait for doctor office visit notes"
                        >
                            <ReplyForm
                                onFormSubmit={this.store.sendInsurerReply}
                                value={this.store.state.insurer_reply}
                            />
                        </ConditionalText>
                    </InsurerCol>
                </CustomRow>
            </Container>
        );
    }
}

export default App;
