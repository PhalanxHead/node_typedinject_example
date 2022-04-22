import { Logger } from "../interfaces/Logger";

export class UnstructuredConsoleLogger implements Logger {
    logDebug(text: string): void {
        console.debug(text);
    }

    logInfo(text: string): void {
        console.log(text);
    }

    logError(message: string, error?: Error): void {
        if(error) {
            console.error(message, error);
        } else {
            console.error(message);
        }
    }
}
