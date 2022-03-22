# Welcome to your CDK TypeScript Test project

This is a test application demonstrating the current issues with local stack KMS and CDK.

To get started, read through the instructions in the [Localstack Directory Readme](./localstack/Readme.md).

This application will:

- Deploy a localstack container in the current version (latest/0.14.x)
- Deploy a node container called `cdk_app`. The app will be built and deployed from here.
- Create an API Gateway instance and KMS Key in localstack
- When the API endpoint is called, it will attempt to sign a predefined message with the given KMS key, and return the JWT signature.

Current behaviour: The Localstack KMS instance returns an unknown error, and the lambda container crashes.

Localstack docker container prints a bunch of errors, indicating that the KMS listener hit an error involving a key of `NoneType`.
My errors from docker are here: https://pastebin.com/58Z3fXi3

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
