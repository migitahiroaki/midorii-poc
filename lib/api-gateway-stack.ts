import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { CommonProps } from './common-props';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface ApiGatewayStackProps extends CommonProps {
  readonly helloWorldLambdaArn: string;
  readonly restApiName: string;
}

export class ApiGatewayStack extends cdk.Stack {
  restApi: apigateway.RestApi;
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    this.restApi = new apigateway.RestApi(this, props.restApiName, {
      restApiName: props.restApiName,
    });

    const helloWorldFunction = lambda.Function.fromFunctionArn(
      this,
      props.helloWorldLambdaArn,
      props.helloWorldLambdaArn
    );

    const apiResource = this.restApi.root.addResource('api');
    const helloResource = apiResource.addResource('hello');
    const postHello = helloResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(helloWorldFunction, {
        proxy: true,
      })
    );
    const getHello = helloResource.addMethod(
      'GET',
      new apigateway.MockIntegration({
        integrationResponses: [
          {
            statusCode: '200',
            selectionPattern: '500',
            responseTemplates: {
              'application/json': JSON.stringify({ message: 'hello world' }),
            },
          },
        ],
      })
    );
    getHello.addMethodResponse({
      statusCode: '200',
    });
  }
}
