export type UserToken = {
    payload: {
        aud: string[];
        email: {
            address: string;
            is_primary: boolean;
            is_verified: boolean;
        };
        exp: number;
        iat: number;
        session_id: string;
        sub: string;
    };
    protectedHeader: {
        alg: string;
        kid: string;
        typ: string;
    };
    key: CryptoKey;
};
