import { RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';
import { Key, KeySpec, KeyUsage } from '@aws-cdk/aws-kms';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from '@aws-cdk/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TestKmsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const kmsKey = new Key(this, 'test-kms-key', {
      removalPolicy: RemovalPolicy.DESTROY,
      keySpec: KeySpec.RSA_2048,
      keyUsage: KeyUsage.SIGN_VERIFY
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [ 'aws-sdk', 'aws-xray-sdk-core'],
      },
      environment: {
        SIGNING_KEY_ID: kmsKey.keyId,
      },
      runtime: Runtime.NODEJS_14_X,
    }

    // Create a Lambda function for each of the CRUD operations
    const kmsSignerLambda = new NodejsFunction(this, 'signerFunction', {
      handler: 'handler',
      entry: path.join(__dirname, '../src/kms-signer.ts'),
      ...nodeJsFunctionProps,
    });

    // Grant the Lambda function read access to the DynamoDB table
		kmsSignerLambda.addToRolePolicy(
			new PolicyStatement({
				actions: ['kms:Sign'],
				resources: ['*'],
				effect: Effect.ALLOW,
			})
		);

    // Integrate the Lambda functions with the API Gateway resource
    const kmsSignerIntegration = new LambdaIntegration(kmsSignerLambda);


    // Create an API Gateway resource for each of the CRUD operations
    const api = new RestApi(this, 'signerApi', {
      restApiName: 'Signer Service'
    });

    const items = api.root.addResource('sign');
    items.addMethod('GET', kmsSignerIntegration);
  }
}
