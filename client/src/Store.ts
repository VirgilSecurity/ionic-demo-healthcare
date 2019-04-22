import { observable, action } from "mobx";
import { Connection, IStateResponse } from './Connnection';
import { IonicAgent } from './models/IonicAgent';
import { Doctor } from "./models/Doctor";
import { Patient } from "./models/Patient";

export interface IStoreProps {
	store?: Store;
}

export class SdkMock {
    encryptText(message: string): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('resolve');
                resolve(message.toUpperCase())
            }, 1000)
        })
    }
    decryptText(message: string): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(message.toLowerCase())
            }, 1000)
        })
    }
}

export class Store {
    conntection = new Connection();

    patient = new IonicAgent({
        username: 'virgil_patient',
        password: 'password123',
        fetchIonicAssertion: () => this.conntection.registerUser({
            email: 'test_patient@virgilsecurity.com',
            groupName: 'patients',
            firstName: 'Test',
            lastName: 'Patient'
        })
    });

    doctor = new IonicAgent({
        username: 'virgil_doctor',
        password: 'password123',
        fetchIonicAssertion: () => this.conntection.registerUser({
            email: 'test_physician@virgilsecurity.com',
            groupName: 'physicians',
            firstName: 'Test',
            lastName: 'Physician'
        })
    });

    insurer = new IonicAgent({
        username: 'virgil_insurer',
        password: 'password123',
        fetchIonicAssertion: () => this.conntection.registerUser({
            email: 'test_insurer@virgilsecurity.com',
            groupName: 'insurers',
            firstName: 'Test',
            lastName: 'Insurer'
        })
    });

    @observable state: {
        "medical_history"?: string,
        "office_visit_notes"?: string,
        "prescription"?: string,
        "insurer_reply"?: string
    } = {
        "medical_history": undefined,
        "office_visit_notes": undefined,
        "prescription": undefined,
        "insurer_reply": undefined
    }

    sdkMock = new SdkMock();

    doctorModel = new Doctor(this);
    patientModel = new Patient(this);

    @action
    loadData() {
        this.conntection.fetchState().then(data => {
            this.state = data;
        });
    }

    @action
    sendMedicalHistory = (value: string) => {
        return this.conntection.updateState({ ...this.state, medical_history: value })
            .then(updatedState => {
                setTimeout(() => {
                    this.state = updatedState;
                }, 2000)
            });
    }

    sendVisitNotes = (value: string) => {
        return this.conntection.updateState({ ...this.state, office_visit_notes: value })
            .then(updatedState => {
                this.state = updatedState;
            });
    }

    sendPrescription = (value: string) => {
        return this.conntection.updateState({ ...this.state, prescription: value })
            .then(updatedState => {
                this.state = updatedState;
            });
    }

    sendInsurerReply = (value: string) => {
        return this.conntection.updateState({ ...this.state, insurer_reply: value })
            .then(updatedState => {
                this.state = updatedState;
            });
    }
}
