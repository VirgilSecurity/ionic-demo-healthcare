/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_IONIC_API_BASE_URL: string;
        REACT_APP_IONIC_ENROLLMENT_ENDPOINT: string;
    }
}
