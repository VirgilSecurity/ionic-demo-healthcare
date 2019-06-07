import React, { Component } from "react";
import { Store } from "./Store";
import { observer } from "mobx-react";
import { Container, Row, Button, Col } from "react-bootstrap";
import { asyncSequence } from "./utils";
import PatientDevice from "./PatientDevice";
import PhysicianDevice from "./PhysicianDevice";
import InsurerDevice from "./InsurerDevice";
import IPhoneCover from "./components/IPhoneCover";

@observer
class App extends Component {
    store = new Store();

    componentDidMount() {
       this.store.loadData();
    }

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
                            <PatientDevice patientModel={this.store.patientModel} />
                        </IPhoneCover>
                    </Col>
                    <PhysicianDevice physicianModel={this.store.physicianModel} />
                    <InsurerDevice insurerModel={this.store.insurerModel} />
                </Row>
            </Container>
        );
    }
}

export default App;
