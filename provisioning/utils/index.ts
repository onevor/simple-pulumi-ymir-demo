import * as pulumi from '@pulumi/pulumi';
export * from './aws-config';
import { REGION, SERVICE_NAME } from './aws-config';

const config = new pulumi.Config(SERVICE_NAME);

export const createServiceName = (name: string) =>
  `${pulumi.getStack()}-${REGION}-${name}`;

export const ENVIRONMENT = config.require('environmentName') as string;