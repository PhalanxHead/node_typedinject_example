import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import base64url from 'base64url';

export const handler = async (event: any = {}): Promise<any> => {

    const message = {value: "Hello World!"};
    console.log(`Signing: ${JSON.stringify(message)}`);
    const signed = await new Signer().sign(message);
    return {
        statusCode: 200, 
        body: JSON.stringify(signed),
    }
};

export class Signer {
    constructor() {
		this.keyId = process.env.SIGNING_KEY_ID || '';
		this.kms = new AWS.KMS();
    }

	private keyId: string;
	private kms: AWS.KMS;

    async sign(payload: unknown) {
        const encodedHeader = base64url(
            JSON.stringify({
                alg: 'RS256',
                kid: this.keyId,
            })
        );

        const encodedPayload = base64url(JSON.stringify(payload));
        const message = Buffer.from(encodedHeader + '.' + encodedPayload);

        const signingResponse = await this.kms
            .sign({
                Message: message,
                KeyId: this.keyId,
                SigningAlgorithm: 'RSASSA_PKCS1_V1_5_SHA_256',
                MessageType: 'RAW',
            })
            .promise();

        if (signingResponse.$response.error) {
            throw new Error('aws kms error');
        }

        const signature = signingResponse.Signature?.toString('base64');
        return signature;
    }
}