import React, { Component } from "react";
import { Store } from "./Store";
import { observer } from "mobx-react";
import { Container, Row, Button, Col } from "react-bootstrap";
import PatientDevice from "./PatientDevice";
import PhysicianDevice from "./PhysicianDevice";
import IPhoneCover from "./components/IPhoneCover";
import { WithDataProvider } from "./components/DataProvider";
import InsurerDevice from "./InsurerDevice";

const PatientDeviceWithData = WithDataProvider(PatientDevice);
const PhysicianDeviceWithData = WithDataProvider(PhysicianDevice);
const InsurerDeviceWithData = WithDataProvider(InsurerDevice);

@observer
class App extends Component {
    store = new Store();

    render() {
        return (
            <Container>
                <Row>
                    <Col lg="4">
                        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Patient</h2>
                        <IPhoneCover>
                            <PatientDeviceWithData
                                store={this.store}
                                model={this.store.patientData}
                            />
                        </IPhoneCover>
                    </Col>
                    <Col lg="4">
                        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Physician</h2>
                        <IPhoneCover>
                            <PhysicianDeviceWithData
                                store={this.store}
                                model={this.store.physicianData}
                            />
                        </IPhoneCover>
                    </Col>
                    <Col lg="4">
                        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Insurer</h2>
                        <IPhoneCover>
                            <InsurerDeviceWithData
                                store={this.store}
                                model={this.store.insurerData}
                            />
                        </IPhoneCover>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Button
                        variant="outline-danger"
                        style={{ marginTop: 20 }}
                        onClick={this.store.reset}
                    >
                        reset
                    </Button>
                </Row>
            </Container>
        );
    }
}

export default App;
