#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
//import { InfraStack } from '../lib/s3/infra-stack';
//import { InfraS3MultipleStack } from '../lib/multiple-s3/infra-stack-multiple-s3';
//import { AcimateInfraLambda } from '../lib/lambda/infra-stack-lambda';
import { AcimateInfraS3TriggerLambda } from '../lib/04-s3-trigger-lambda/infra-stack-s3-trigger-lambda';

const app = new cdk.App();
new AcimateInfraS3TriggerLambda(app, 'AcimateInfraS3TriggerLambda', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
   env: { account: '707690426194', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});