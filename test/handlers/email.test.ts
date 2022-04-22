import { createInjector, Injector } from 'typed-inject';
import { run_email_handler } from '@/handlers/email';
import { UnstructuredConsoleLogger } from '@/services/UnstructuredConsoleLogger';
import * as DiTokens from '@/utils/DiTokens';
import { SmtpConfig, SmtpEmailSender } from '@/services/SmtpEmailSender';

describe('main', () => {
    describe('run_main', () => {
        let testInjector: Injector<any>;
        const testSmtpCredentials: SmtpConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            username: 'brandt.homenick96@ethereal.email',
            password: 'NwfpC5wYUmzXh6C8Pn',
        };

        beforeAll(() => {
            testInjector = createInjector()
                .provideValue(DiTokens.SENDING_EMAIL, 'brandt.homenick96@ethereal.email')
                .provideValue(DiTokens.SMTP_CREDENTIALS, testSmtpCredentials)
                .provideValue(DiTokens.BCC_LIST, ['luka.hedt@twobulls.com'])
                .provideClass(DiTokens.LOGGER, UnstructuredConsoleLogger)
                .provideClass(DiTokens.EMAIL_SENDING_SERVICE, SmtpEmailSender);
        });

        it('Returns 200', async () => {
            const inputBody = { value: 'Hi' };
            try {
                const endpointResponse = await run_email_handler(JSON.stringify(inputBody), testInjector);
                expect(endpointResponse.statusCode).toEqual(200);
            } catch (error) {
                console.error(error);
            }
        });

        it('Sends an Email', async () => {
            const inputBody = { value: 'Hello There!' };
            try {
                const endpointResponse = await run_email_handler(JSON.stringify(inputBody), testInjector);
                expect(endpointResponse.statusCode).toEqual(200);
            } catch (error) {
                console.error(error);
            }
        });
    });
});
