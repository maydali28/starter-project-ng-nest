export interface ICoreConfigEnv {
    readonly nodeEnv: 'dev' | 'test' | 'prod';
    db: {
        mongo: {
            mongoConnectionUri: string;
            options: {
                dbName: string;
            };
        };
    };
    http: {
        domain: string;
        port: number;
        protocol: 'http' | 'https';
        rootUrl: string;
    };
    social: {
        facebook: {
            clientID: string;
            clientSecret: string;
        };
    };
    jwt: {
        jwtPrivateKey: string;
        jwtPublicKey: string;
    };
    mailer: {
        service: string,
        host: string,
        port: number,
    };
    transalte: {
        prefix: string;
        defaultLang?: string;
    }
}