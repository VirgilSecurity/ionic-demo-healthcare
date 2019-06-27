import { Mutex } from 'async-mutex';
import { ISAgent, IProfileInfo, IProfileInfoWithSamlAssertion } from 'ionic-js-sdk';

export interface IonicAgentParams {
    username: string;
    password: string;
    enrollmentUrl: string;
    fetchSamlAssertion: () => Promise<string>;
}

export type DataClassification = 'Medical History'|'Office Visit Notes'|'Prescription Order'|'Insurance Reply';

const ActiveProfileMutex = new Mutex();

export class IonicAgent {
    profileInfo: IProfileInfo;
    sdk: ISAgent;
    fetchSamlAssertion: () => Promise<string>;

    constructor({ username, password, fetchSamlAssertion, enrollmentUrl }: IonicAgentParams) {
        this.profileInfo = {
            appId: 'healthcare-demo',
            userId: username,
            userAuth: password,
            enrollmentUrl: enrollmentUrl
        };
        this.sdk = new ISAgent(`${process.env.REACT_APP_IONIC_API_BASE_URL}/jssdk/latest/`);
        this.fetchSamlAssertion = fetchSamlAssertion;
    }

    private loadUser() {
        return this.sdk.loadUser(this.profileInfo)
        .then(response => {
            this.profileInfo.deviceId = response.profiles[0].deviceId;
            return response;
        });
    }

    // This method is necessary because we have 3 different users with
    // 3 different profiles on the same page and Ionic JS SDK's methods,
    // like encryptStringChunkCipher, assume a single "active" profile.
    // When one user enters the data, for example, Patient entering
    // "Medical History", the other two - Physician and Insurer in this case -
    // try to decrypt it at the same time. This helper method ensures that
    // they do so "in turns" with their appropriate profile being active.
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
                // No SEP exists for the current user
                return this.register();
            } else {
                console.error('Unexpected error loading user %o', err);
                return Promise.reject(err);
            }
        });
    }

    register() {
        return this.fetchSamlAssertion()
        .then(samlAssertionXml => {
            const profileInfoWithSamlAssertion: IProfileInfoWithSamlAssertion = {
                ...this.profileInfo,
                samlAssertionXml
            };
            return this.sdk.enrollUserWithSamlAssertion(profileInfoWithSamlAssertion);
        })
        .then(() => this.loadUser());
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
