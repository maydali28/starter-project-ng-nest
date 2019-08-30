import { AccessPermissionsContract } from '@core/global-contracts/lib/domain/access-permissions/access-permissions.contract';

declare module '*.json' {
    const value: any;
    export default value;
}

declare global {
    namespace Express {
        export interface Request {
            accessPermissions?: AccessPermissionsContract;
        }
    }
}