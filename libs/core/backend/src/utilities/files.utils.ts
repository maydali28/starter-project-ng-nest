import * as path from 'path';
import { readFileSync } from 'fs';

export function resolveRootFile(rootPath: string, fileName: string) {
    console.log('CurrentPath', rootPath);
    return path.resolve(__dirname, rootPath, fileName);
}
export function loadRootJson<T = any>(rootPath: string, fileName: string) {
    return JSON.parse(readFileSync(resolveRootFile(rootPath, fileName)).toString()) as T;
}