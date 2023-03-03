import * as aws from '@pulumi/aws';
import { Region } from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

const awsConfig = new pulumi.Config('aws');
const serviceConfig = new pulumi.Config('service');

export const SERVICE_NAME: string = serviceConfig.require(
  'serviceName'
) as string;

export const REGION = awsConfig.require('region') as pulumi.Input<Region>;
export const AWS_ACCOUNT_ID = aws
  .getCallerIdentity({})
  .then((current: { accountId: string }) => current.accountId);

export const AWS_PROVIDER_OPTIONS = {
  provider: new aws.Provider('providerOptions', {
    region: REGION,
  }),
};