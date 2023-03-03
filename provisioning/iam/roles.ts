import * as aws from '@pulumi/aws';
import { AWS_PROVIDER_OPTIONS, createServiceName } from '../utils';
import { ssmPolicy, lambdaInvokePolicy, lambdaLoggingPolicy, dynamoPolicy } from './policies';

export const lambdaRoleName = createServiceName('lambda-role');
export const lambdaRole = new aws.iam.Role(
  lambdaRoleName,
  {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: ['lambda.amazonaws.com'],
    }),
    managedPolicyArns: [
      ssmPolicy.arn,
      lambdaInvokePolicy.arn,
      lambdaLoggingPolicy.arn,
      dynamoPolicy.arn,
    ],
  },
  AWS_PROVIDER_OPTIONS
);