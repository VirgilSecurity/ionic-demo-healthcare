declare namespace IonicSdk {
    interface IAppData {
        appId: string;
        userId: string;
        userAuth: string;
        enrollmentUrl: string;
    }

    interface ISdkResponse {
        sdkResponseCode: number;
    }

    interface IChunkCipherInput {
        stringData: string;
        cipher?: 'v1'|'v2';
        attributes?: { [key: string]: string };
    }

    interface IChunkCipherOutput {
        stringChunk: string;
    }

    class ISAgent {
        constructor(sourceUrl: string);
        enrollUser(appData: IAppData): Promise<ISdkResponse>;
        loadUser(appData: IAppData): Promise<ISdkResponse>;
        createDevice(ionicAssertion: object): Promise<ISdkResponse>;
        encryptStringChunkCipher(input: IChunkCipherInput): Promise<IChunkCipherOutput>;
        decryptStringChunkCipher(input: IChunkCipherInput): Promise<IChunkCipherOutput>;
    }
}

declare global {
    const IonicSdk = IonicSdk;
}
