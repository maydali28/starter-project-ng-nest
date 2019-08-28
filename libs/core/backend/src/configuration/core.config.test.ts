import { ICoreConfigEnv } from './core.config.env.interface';

export const CoreConfigEnv: ICoreConfigEnv = {
  nodeEnv: 'test',
  db: {
    mongo: {
      mongoConnectionUri: 'mongodb://localhost-test',
      options: {
        dbName: 'my-nestjs-bff-app-e2e'
      }
    }
  },
  http: {
    domain: 'localhost',
    port: 1337,
    protocol: 'http',
    get rootUrl() {
      return `${this.domain}:${this.port}`;
    }
  },
  social: {
    facebook: {
      clientID: 'your-secret-clientID-here', // your App ID
      clientSecret: 'your-client-secret-here' // your App Secret
    }
  },
  jwt: {
    jwtPrivateKey: '',
    jwtPublicKey: ''
  },
  mailer: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587
  },
  transalte: {
    prefix: '',
    defaultLang: ''
  }
};
