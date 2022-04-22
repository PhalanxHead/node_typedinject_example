#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { TestKmsStack } from '../lib/test_kms-stack';

const app = new App();
new TestKmsStack(app, 'TestKmsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});