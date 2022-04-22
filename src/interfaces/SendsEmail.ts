export interface SendsEmail {
    sendMail(recipients: string[], subject: string, message: string): Promise<void>;
}
