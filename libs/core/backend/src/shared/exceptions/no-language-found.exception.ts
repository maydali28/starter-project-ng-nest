import { AppError } from "./app.exception";

export class NoLanguageFoundException extends AppError {
    constructor(public lang: string, public path: string) {
        super(`no language ${lang} found in ${path}`);
    }
}