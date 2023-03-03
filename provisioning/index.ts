import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as nodePath from 'path';

import { lambdaRole } from './iam/roles';
import { AWS_PROVIDER_OPTIONS, SERVICE_NAME, createServiceName } from './utils';

const { apigateway } = awsx.classic;

const config = new pulumi.Config(SERVICE_NAME);

const userTableName = createServiceName('user-table');
const userTable = new aws.dynamodb.Table(userTableName, {
  attributes: [
    {
      name: 'userId',
      type: 'S',
    },
  ],
  billingMode: 'PAY_PER_REQUEST',
  hashKey: 'userId',
});

export const userTableNameResult = userTable.name;

const lambdaFunctionName = createServiceName('lambda-function');
const lambdaFunction = new aws.lambda.Function(
  lambdaFunctionName,
  {
    code: new pulumi.asset.FileArchive(nodePath.join(__dirname, '../dist')),
    handler: 'lambda.handler',
    role: lambdaRole.arn,
    runtime: aws.lambda.Runtime.NodeJS16dX,
    timeout: 30,
    environment: {
      variables: {
        ENVIRONMENT: config.require('environmentName'),
        TABLE_NAME: userTable.name
      },
    },
  },
  AWS_PROVIDER_OPTIONS
);

export const lambdaProps = {
  name: lambdaFunction.name,
  arn: lambdaFunction.arn,
  invokeArn: lambdaFunction.invokeArn,
  urn: lambdaFunction.urn,
};

const apigatewayName = createServiceName('test-api');
const endpoint = new apigateway.API(apigatewayName, {
  routes: [
    {
      path: '/',
      method: 'GET',
      eventHandler: lambdaFunction,
    },
    {
      path: '/',
      method: 'POST',
      eventHandler: lambdaFunction,
    },
  ],
});

exports.url = endpoint.url;