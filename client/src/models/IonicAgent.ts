import { Mutex } from 'async-mutex';

export interface IonicAgentParams {
    username: string;
    password: string;
    fetchIonicAssertion: () => Promise<object>;
}

export type DataClassification = 'patient_physician'|'patient_physician_insurer';

const ActiveProfileMutex = new Mutex();

export class IonicAgent {
    profileInfo: IonicSdk.IProfileInfo;
    sdk: IonicSdk.ISAgent;
    fetchAssertion: () => Promise<object>;

    constructor({ username, password, fetchIonicAssertion }: IonicAgentParams) {
        this.profileInfo = {
            appId: 'helloworld',
            userId: username,
            userAuth: password,
            enrollmentUrl: 'http://localhost:8080/'
        };
        this.sdk = new IonicSdk.ISAgent('https://preview-api.ionic.com/jssdk/latest/');
        this.fetchAssertion = fetchIonicAssertion;
    }

    private loadUser() {
        return this.sdk.loadUser(this.profileInfo)
        .then(response => {
            this.profileInfo.deviceId = response.profiles[0].deviceId;
            return response;
        });
    }

    private runWithActiveProfile = (fn: any) => (...args: any[]) => {
        return ActiveProfileMutex.acquire()
        .then(release => {
            return this.sdk.setActiveProfile(this.profileInfo)
            .then(() => fn(...args))
            .then(
                result => {
                    release();
                    return result;
                },
                error => {
                    release();
                    throw error;
                }
            );
        });
    }

    loadProfile() {
        return this.loadUser()
        .catch(err => {
            if (
                err &&
                err.sdkResponseCode &&
                (err.sdkResponseCode === 40022 || err.sdkResponseCode === 40002)
            ) {
                return this.register();
            } else {
                console.error('Unexpected error loading user %o', err);
                return Promise.reject(err);
            }
        });
    }

    register() {
        return this.sdk.enrollUser(this.profileInfo)
        .then(resp => {
            if (resp.sdkResponseCode === 0) {
                // ignore resp.redirect and resp.notifier
                return this.fetchAssertion()
                    .then(assertion => this.sdk.createDevice(assertion))
                    .then(() => this.loadUser());
            }
            else {
                console.log('Unexpected enrollment response: ', resp);
                return Promise.reject(new Error('Error enrolling'));
            }
        });
    }

    encryptText = this.runWithActiveProfile((plaintext: string, classification: DataClassification) => {
        return this.sdk.encryptStringChunkCipher({
            stringData: plaintext,
            cipher: 'v2',
            mutableAttributes: {
                classification: [classification]
            }
        })
        .then(res => res.stringChunk);
    })

    decryptText = this.runWithActiveProfile((ciphertext: string) => {
        return this.sdk.decryptStringChunkCipher({stringData: ciphertext})
        .then(res => res.stringChunk);
    });
}
