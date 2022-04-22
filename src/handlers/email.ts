import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Injector } from 'typed-inject';
import { EmailService } from '../services/EmailService';
import { createDependencyContainer } from '@/utils/DependencySetup';

/**
 * RestAPI Endpoint - POST /email
 * Sends an email to a given address with a given message.
 * Body expected format is the following:
 * ```json
 * {
 *     "sendMailTo": ["<recipient email address(es)>"],
 *     "subject": "<email subject>"
 *     "message": "<The message to send>"
 * }
 * ```
 * @param event - The API Event object. Contains headers and the body
 * @returns
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return await run_email_handler(event.body || '', createDependencyContainer());
};

export async function run_email_handler(body: string, dependencyContainer: Injector<any>): Promise<APIGatewayProxyResult> {
    const emailService: EmailService = dependencyContainer.injectClass(EmailService);
    await emailService.sendEmail(['luka.hedt@twobulls.com'], 'Hello World!', body);
    return {
        statusCode: 200,
        body: JSON.stringify({ val0: 'hello' }),
    };
}
