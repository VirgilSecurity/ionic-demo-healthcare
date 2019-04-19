
import { observable, action } from "mobx";

export interface IStateResponse {
    medical_history?: string,
    office_visit_notes?: string,
    prescription?: string,
    insurer_reply?: string
} 
export interface IStoreProps {
	store?: Store;
}
export class Store {
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

    private fetchState = () => {
        return fetch('/state').then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching state: ${response.status}: ${response.statusText}`);
            }
            return response.json();
        });
    }

    private updateState = (data: IStateResponse) => {
        return fetch('/state', {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Error updating state: ${response.status}: ${response.statusText}`);
                }
                return response.json();
            });
    }
    
    @action
    loadData() {
        this.fetchState().then(data => {
            this.state = data;
        });
    }

    sendMedicalHistory = (value: string) => {
        return this.updateState({ ...this.state, medical_history: value })
            .then(updatedState => {
                this.state = updatedState;
            });
    }

    sendVisitNotes = (value: string) => {
        return this.updateState({ ...this.state, office_visit_notes: value })
            .then(updatedState => {
                this.state = updatedState;
            });
    }

    sendPrescription = (value: string) => {
        return this.updateState({ ...this.state, prescription: value })
            .then(updatedState => {
                this.state = updatedState;
            });
    }

    sendInsurerReply = (value: string) => {
        return this.updateState({ ...this.state, insurer_reply: value })
            .then(updatedState => {
                this.state = updatedState;
            });
    }
}