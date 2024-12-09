import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { interpretationLambda } from './interpretation-lambda/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  interpretationLambda
});

const statement = new PolicyStatement({
  sid: "AllowPublishToDigest",
  actions: ["ssm:GetParameter"],
  resources: ["*"]
})

backend.interpretationLambda.resources.lambda.addToRolePolicy(statement);
