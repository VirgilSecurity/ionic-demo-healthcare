import { observable, action } from "mobx";
import { Connection } from "./Connnection";
import { IonicAgent } from "./models/IonicAgent";
import { PhysicianModel } from "./models/PhysicianModel";
import { PatientModel } from "./models/PatientModel";
import { InsurerModel } from "./models/InsurerModel";

export interface IStoreProps {
    store?: Store;
}

export class Store {
    connection = new Connection();

    patient = new IonicAgent({
        username: "test_patient",
        password: "password123",
        fetchIonicAssertion: () =>
            this.connection.registerUser({
                email: "test_patient@healthcaredemo.com",
                groupName: "patients",
                firstName: "Test",
                lastName: "Patient"
            })
    });

    physician = new IonicAgent({
        username: "test_physician",
        password: "password123",
        fetchIonicAssertion: () =>
            this.connection.registerUser({
                email: "test_physician@healthcaredemo.com",
                groupName: "physicians",
                firstName: "Test",
                lastName: "Physician"
            })
    });

    insurer = new IonicAgent({
        username: "test_insurer",
        password: "password123",
        fetchIonicAssertion: () =>
            this.connection.registerUser({
                email: "test_insurer@healthcaredemo.com",
                groupName: "insurers",
                firstName: "Test",
                lastName: "Insurer"
            })
    });

    @observable state: {
        medical_history?: string;
        office_visit_notes?: string;
        prescription?: string;
        insurer_reply?: string;
    } = {
        medical_history: undefined,
        office_visit_notes: undefined,
        prescription: undefined,
        insurer_reply: undefined
    };

    physicianModel = new PhysicianModel(this);
    patientModel = new PatientModel(this);
    insurerModel = new InsurerModel(this);

    @action.bound
    loadData() {
        this.connection.fetchState().then(data => {
            this.state = data;
        });
    }

    @action.bound
    sendMedicalHistory(value: string) {
        return this.connection
            .updateState({ ...this.state, medical_history: value })
            .then(updatedState => {
                this.state = updatedState;
                return value;
            });
    }

    @action.bound
    sendVisitNotes(value: string) {
        return this.connection
            .updateState({ ...this.state, office_visit_notes: value })
            .then(updatedState => {
                this.state = updatedState;
                return value;
            });
    }

    @action.bound
    sendPrescription = (value: string) => {
        return this.connection
            .updateState({ ...this.state, prescription: value })
            .then(updatedState => {
                this.state = updatedState;
                return value;
            });
    };

    @action.bound
    sendInsurerReply = (value: string) => {
        return this.connection
            .updateState({ ...this.state, insurer_reply: value })
            .then(updatedState => {
                this.state = updatedState;
                return value;
            });
    };

    reset = () => {
        this.connection.reset().then(() => document.location.reload());
    }
}
