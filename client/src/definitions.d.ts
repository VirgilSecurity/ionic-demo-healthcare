declare module 'ionic-js-sdk' {
    export interface IProfileInfo {
        appId: string;
        userId: string;
        userAuth: string;
        enrollmentUrl: string;
        deviceId?: string;
    }

    export interface IProfileInfoWithSamlAssertion implements IProfileInfo {
        samlAssertionXml: string;
    }

    export interface ISdkResponse {
        sdkResponseCode: number;
    }

    export interface IChunkCipherInput {
        stringData: string;
        cipher?: 'v1'|'v2';
        attributes?: { [key: string]: string };
        mutableAttributes?: { [key: string]: string|string[] };
    }

    export interface IChunkCipherOutput {
        stringChunk: string;
    }

    export class ISAgent {
        constructor(sourceUrl?: string);
        enrollUser(profileInfo: IProfileInfo): Promise<ISdkResponse>;
        enrollUserWithSamlAssertion(profileInfo: IProfileInfoWithSamlAssertion): Promise<ISdkResponse>;
        loadUser(profileInfo: IProfileInfo): Promise<ISdkResponse & { profiles: ({ deviceId: string})[] }>;
        createDevice(ionicAssertion: object): Promise<ISdkResponse>;
        encryptStringChunkCipher(input: IChunkCipherInput): Promise<IChunkCipherOutput>;
        decryptStringChunkCipher(input: IChunkCipherInput): Promise<IChunkCipherOutput>;
        setActiveProfile(profileInfo): Promise<ISdkResponse>;
    }
}
