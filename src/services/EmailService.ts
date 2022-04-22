import * as DiTokens from "@/utils/DiTokens";
import { SendsEmail } from "../interfaces/SendsEmail";
import { Logger } from "../interfaces/Logger";

export class EmailService {
    constructor(private myLogger: Logger, private emailSender: SendsEmail) {}
    // Magic String to resolve dependencies
    public static inject = [DiTokens.LOGGER, DiTokens.EMAIL_SENDING_SERVICE] as const;

    async sendEmail(recipients: string[], subject: string, message: string): Promise<void> {
        this.myLogger.logInfo(`[EmailService] Sending Email [Subject: ${subject}, Message: ${message}] to [${recipients.join(', ')}]`);
        await this.emailSender.sendMail(recipients, subject, message);
    }

    isValidEmailAddress(address: string): boolean {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return validRegex.test(address);
    }
}
