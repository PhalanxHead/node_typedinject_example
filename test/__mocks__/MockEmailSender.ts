import { SendsEmail } from "@/interfaces/SendsEmail";

export class MockEmailSender implements SendsEmail {
    constructor() {}

    async sendMail(recipients: string[], subject: string, message: string): Promise<void> {
        console.log(`[MockEmailSender] Sending Email [Subj: ${subject}, Message: ${message}] to ${recipients.join(', ')}`);
    }
}