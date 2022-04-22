import * as DiTokens from '@/utils/DiTokens';
import SES from 'aws-sdk/clients/ses';
import { Logger } from '@/interfaces/Logger';
import { SendsEmail } from '@/interfaces/SendsEmail';

export class AwsSesEmailSender implements SendsEmail {
    constructor(private senderEmail: string, private auditBccEmail: string[], private myLogger: Logger) {}

    static inject = [DiTokens.SENDING_EMAIL, DiTokens.BCC_LIST, DiTokens.LOGGER] as const;
    async sendMail(recipients: string[], subject: string, message: string): Promise<void> {
        const sesClient = new SES();

        this.myLogger.logDebug('Sending email via SES');

        const sendMailReq: SES.SendEmailRequest = {
            Source: this.senderEmail,
            Destination: { BccAddresses: recipients },
            Message: { Subject: { Data: subject }, Body: { Text: { Data: message } } },
        };

        this.myLogger.logDebug(`Mail Request: ${JSON.stringify(sendMailReq)}`);

        try {
            const response = await sesClient.sendEmail(sendMailReq).promise();
            this.myLogger.logInfo(`SES Response: ${response.MessageId}`);
        } catch (err) {
            this.myLogger.logError('Sending Email Failed', err as Error);
        }
    }
}
