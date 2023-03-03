import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import {
  REGION,
  AWS_ACCOUNT_ID,
  SERVICE_NAME,
  ENVIRONMENT,
  createServiceName,
} from '../utils';

const config = new pulumi.Config(SERVICE_NAME);

const ssmPolicyName = createServiceName('ssm-policy');
export const ssmPolicy = new aws.iam.Policy(ssmPolicyName, {
  policy: pulumi.interpolate`{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:PutParameter"
        ],
        "Resource": "arn:aws:ssm:${REGION}:${AWS_ACCOUNT_ID}:parameter/${ENVIRONMENT}-*"
      }
    ]
  }`,
});

const lambdaPolicyName = createServiceName('lambda-invoke-policy');
export const lambdaInvokePolicy = new aws.iam.Policy(lambdaPolicyName, {
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['lambda:InvokeFunction'],
        Resource: '*',
      },
    ],
  }),
});

export const lambdaLoggingPolicyName = createServiceName(
  'lambda-logging-policy'
);
export const lambdaLoggingPolicy = new aws.iam.Policy(lambdaLoggingPolicyName, {
  path: '/',
  description: 'Allows Lambda functions to write logs to CloudWatch',
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        Resource: 'arn:aws:logs:*:*:*',
      },
    ],
  }),
});


export const dynamoPolicy = new aws.iam.Policy(`${pulumi.getStack()}-dynamoPolicy`, {
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: ['dynamodb:*'],
        Effect: 'Allow',
        Resource: '*',
      },
    ],
  }),
});