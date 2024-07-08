#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack } from '../lib/api-gateway-stack';

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT!,
  region: process.env.CDK_DEFAULT_REGION!,
};

const app = new cdk.App();
const apiGatewayStack = new ApiGatewayStack(
  app,
  'midorii-poc-stack-apigateway',
  {
    projectName: 'midorii',
    env,
    restApiName: 'poc-api-gateway',
    helloWorldLambdaArn: `arn:aws:lambda:${env.region}:${env.account}:function:helloworld`,
  }
);
