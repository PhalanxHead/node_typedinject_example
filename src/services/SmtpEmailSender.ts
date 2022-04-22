import nodemailer from 'nodemailer';
import { Logger } from '@/interfaces/Logger';
import { SendsEmail } from '@/interfaces/SendsEmail';
import * as DiTokens from '@/utils/DiTokens';

export type SmtpConfig = {
    username: string;
    password: string;
    port?: number;
    host: string; // 'smtp.ethereal.email'
};

export class SmtpEmailSender implements SendsEmail {
    constructor(
        private senderEmail: string,
        private serverConfig: SmtpConfig,
        private auditBccEmail: string[],
        private myLogger: Logger
    ) {}

    static inject = [DiTokens.SENDING_EMAIL, DiTokens.SMTP_CREDENTIALS, DiTokens.BCC_LIST, DiTokens.LOGGER] as const;

    async sendMail(recipients: string[], subject: string, message: string): Promise<void> {
        this.myLogger.logDebug(`Sending mail via host: ${this.serverConfig.host}`);

        let transporter = nodemailer.createTransport({
            host: this.serverConfig.host,
            port: this.serverConfig.port || 587,
            secure: this.serverConfig.port === 465,
            auth: {
                user: this.serverConfig.username,
                pass: this.serverConfig.password,
            },
        });

        const newMail = {
            from: this.senderEmail,
            bcc: recipients.concat(this.auditBccEmail),
            subject: subject,
            text: message,
        };

        this.myLogger.logDebug(`Mail contents: ${JSON.stringify(newMail)}`);

        try {
            let info = await transporter.sendMail(newMail);
            this.myLogger.logInfo(`Message sent: ${info.messageId}`);
        } catch (err) {
            this.myLogger.logError('Sending Email Failed', err as Error);
        }
    }
}
