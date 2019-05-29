import { Mutex } from 'async-mutex';

export interface IonicAgentParams {
    username: string;
    password: string;
    enrollmentUrl: string;
    fetchSamlAssertion: () => Promise<string>;
}

export type DataClassification = 'Medical History'|'Office Visit Notes'|'Prescription Order'|'Insurance Reply';

const ActiveProfileMutex = new Mutex();

export class IonicAgent {
    profileInfo: IonicSdk.IProfileInfo;
    sdk: IonicSdk.ISAgent;
    fetchSamlAssertion: () => Promise<string>;

    constructor({ username, password, fetchSamlAssertion, enrollmentUrl }: IonicAgentParams) {
        this.profileInfo = {
            appId: 'healthcare-demo',
            userId: username,
            userAuth: password,
            // This is a discard parameter that we don't actually use,
            // because we employ a "hybrid" enrollment method where our
            // app's backend acts as Identity Provider, i.e. generates
            // SAML Assertion and Ionic Assertion for device enrollment.
            // This is not an officially supported "method" of enrollment.
            // For supported methods see https://dev.ionic.com/platform/enrollment
            enrollmentUrl: enrollmentUrl
        };
        this.sdk = new IonicSdk.ISAgent();
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

    private getIonicAssertion(samlResponseXml: string) {
        console.log('Sending SAML response to enrollemnt url');
        return fetch(this.profileInfo.enrollmentUrl, {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'expect': '100-continue',
            },
            body: new URLSearchParams({ SAMLResponse: samlResponseXml })
        }).then(enrollmentResponse => {
            console.log(`Enrollment response: ${enrollmentResponse.status}`);

            const ionicAssertion = {
                'X-Ionic-Reg-Uidauth': enrollmentResponse.headers['X-Ionic-Reg-Uidauth'],
                'X-Ionic-Reg-Stoken': enrollmentResponse.headers['X-Ionic-Reg-Stoken'],
                'X-Ionic-Reg-Ionic-API-Urls': enrollmentResponse.headers['X-Ionic-Reg-Ionic-Url'],
                'X-Ionic-Reg-Enrollment-Tag': enrollmentResponse.headers['X-Ionic-Reg-Enrollment-Tag'],
                'X-Ionic-Reg-Pubkey': enrollmentResponse.headers['X-Ionic-Reg-Pubkey']
            };

            return ionicAssertion;
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
        // Ionic JavaScript SDK assumes that an 'enrollment attempt' information
        // already exists in localStorage prior to the call to `createDevice()`,
        // that's why we're making an `enrollUser()` call with throwaway enrollment
        // server url. This way we're bypassing the JSSDK requirement that the
        // `createDevice()` call is made by an enrollment server.
        // See https://api.ionic.com/jssdk/latest/Docs/ISAgent.html#enrollUser
        return this.sdk.enrollUser(this.profileInfo)
        .then(resp => {
            if (resp.sdkResponseCode === 0) {
                // Enrollment Attempt is created and saved in localStorage.
                // Normally, this is where you would redirect the user
                // to your Enrollment Server URL, specified by `resp.redirect`,
                // for identity confirmation, which would then call `createDevice().
                // We ignore `resp.redirect` and `resp.notifier` (which is a Promise
                // that resolves when enrollment completes) here because we use custom
                // enrollment "method" - see comment in the constructor of IonicAgent
                return this.fetchSamlAssertion()
                    .then(samlResponseXml => this.getIonicAssertion(samlResponseXml))
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
