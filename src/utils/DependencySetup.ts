import * as DiTokens from '@/utils/DiTokens';
import { SmtpConfig, SmtpEmailSender } from '@/services/SmtpEmailSender';
import { UnstructuredConsoleLogger } from '@/services/UnstructuredConsoleLogger';
import { createInjector } from 'typed-inject';

export function createDependencyContainer() {
    const mainSmtpCredentials: SmtpConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        username: 'brandt.homenick96@ethereal.email',
        password: 'NwfpC5wYUmzXh6C8Pn',
    };
    const dependencyContainer = createInjector()
        .provideValue(DiTokens.SENDING_EMAIL, 'brandt.homenick96@ethereal.email')
        .provideValue(DiTokens.SMTP_CREDENTIALS, mainSmtpCredentials)
        .provideValue(DiTokens.BCC_LIST, ['luka.hedt@twobulls.com'])
        .provideClass(DiTokens.LOGGER, UnstructuredConsoleLogger)
        .provideClass(DiTokens.EMAIL_SENDING_SERVICE, SmtpEmailSender);

    return dependencyContainer;
}
