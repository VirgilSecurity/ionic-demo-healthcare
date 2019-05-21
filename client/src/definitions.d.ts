declare namespace IonicSdk {
    interface IProfileInfo {
        appId: string;
        userId: string;
        userAuth: string;
        enrollmentUrl?: string;
        deviceId?: string;
    }

    interface ISdkResponse {
        sdkResponseCode: number;
    }

    interface IChunkCipherInput {
        stringData: string;
        cipher?: 'v1'|'v2';
        attributes?: { [key: string]: string };
        mutableAttributes?: { [key: string]: string|string[] };
    }

    interface IChunkCipherOutput {
        stringChunk: string;
    }

    class ISAgent {
        constructor(sourceUrl?: string);
        enrollUser(profileInfo: IProfileInfo): Promise<ISdkResponse>;
        loadUser(profileInfo: IProfileInfo): Promise<ISdkResponse & { profiles: ({ deviceId: string})[] }>;
        createDevice(ionicAssertion: object): Promise<ISdkResponse>;
        encryptStringChunkCipher(input: IChunkCipherInput): Promise<IChunkCipherOutput>;
        decryptStringChunkCipher(input: IChunkCipherInput): Promise<IChunkCipherOutput>;
        setActiveProfile(profileInfo): Promise<ISdkResponse>;
    }
}

declare global {
    const IonicSdk = IonicSdk;
}
