import React, { Component } from "react";
import { Store, Device } from "./Store";
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
            <Container fluid>
                <Button variant="outline-danger" onClick={this.store.reset}>
                    reset
                </Button>
                <Row>
                    <Col
                        lg="3"
                        style={{
                            backgroundColor: "rgba(255, 0, 0, 0.05)"
                        }}
                    >
                        <h2>Patient Device</h2>
                        <IPhoneCover>
                            <PatientDeviceWithData store={this.store} model={this.store.patientData}  />
                        </IPhoneCover>
                    </Col>
                    <Col
                        lg="3"
                        style={{
                            backgroundColor: "rgba(255, 0, 0, 0.05)"
                        }}
                    >
                        <h2>Physician Device</h2>
                        <IPhoneCover>
                            <PhysicianDeviceWithData store={this.store} model={this.store.physicianData}  />
                        </IPhoneCover>
                    </Col>
                    <Col
                        lg="3"
                        style={{
                            backgroundColor: "rgba(255, 0, 0, 0.05)"
                        }}
                    >
                        <h2>Insurer Device</h2>
                        <IPhoneCover>
                            <InsurerDeviceWithData store={this.store} model={this.store.insurerData} />
                        </IPhoneCover>
                    </Col>
                    {/* <InsurerDevice insurerModel={this.store.insurerModel} /> */}
                </Row>
            </Container>
        );
    }
}

export default App;
