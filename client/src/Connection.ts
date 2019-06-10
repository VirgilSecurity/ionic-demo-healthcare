export interface IStateResponse {
    medical_history?: string,
    office_visit_notes?: string,
    prescription?: string,
    insurer_reply?: string
}

export interface IRegisterUserParams {
    email: string;
    groupName: 'patients'|'physicians'|'insurers';
    firstName: string;
    lastName: string;
}

export class Connection {
    fetchState = (): Promise<IStateResponse> => {
        return fetch('/state').then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching state: ${response.status}: ${response.statusText}`);
            }
            return response.json();
        });
    }

    updateState = (data: IStateResponse) => {
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

    registerUser = (params: IRegisterUserParams) => {
        return fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error registering user: ${response.status}: ${response.statusText}`);
            }
            return response.json();
        }).then(({ assertion, user }) => assertion); // ignore "user" property for now
    }

    reset = () => {
        return fetch('/state', {
            method: 'DELETE'
        })
    }
}
