export interface Logger {
    logDebug(text: string): void;
    logInfo(text: string): void;
    logError(message: string, error?: Error): void;
}
