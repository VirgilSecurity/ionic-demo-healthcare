export interface IonicAgentParams {
    username: string;
    password: string;
    fetchIonicAssertion: () => Promise<object>;
}

export class IonicAgent {
    appData: IonicSdk.IAppData;
    sdk: IonicSdk.ISAgent;
    fetchAssertion: () => Promise<object>;

    constructor({ username, password, fetchIonicAssertion }: IonicAgentParams) {
        this.appData = {
            appId: 'helloworld',
            userId: username,
            userAuth: password,
            enrollmentUrl: 'http://localhost:8080/' // will not be used
        };
        this.sdk = new IonicSdk.ISAgent('https://preview-api.ionic.com/jssdk/latest/');
        this.fetchAssertion = fetchIonicAssertion;
    }

    loadProfile() {
        return this.sdk.loadUser(this.appData)
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
        return this.sdk.enrollUser(this.appData)
        .then(resp => {
            if (resp.sdkResponseCode === 0) {
                // ignore resp.redirect and resp.notifier
                return this.fetchAssertion()
                    .then(assertion => this.sdk.createDevice(assertion))
                    .then(() => this.sdk.loadUser(this.appData));
            }
            else {
                console.log('Unexpected enrollment response: ', resp);
                return Promise.reject(new Error('Error enrolling'));
            }
        });
    }

    encryptText(plaintext: string) {
        return this.sdk.encryptStringChunkCipher({
            stringData: plaintext,
            cipher: 'v2'
        })
        .then(res => res.stringChunk);
    }

    decryptText(ciphertext: string) {
        return this.sdk.decryptStringChunkCipher({stringData: ciphertext})
        .then(res => res.stringChunk);
    }
}
