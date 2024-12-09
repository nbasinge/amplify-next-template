import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { getInterpretation } from './interpretation-lambda/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  getInterpretation
});

const statement = new PolicyStatement({
  sid: "AllowPublishToDigest",
  actions: ["ssm:GetParameter"],
  resources: ["*"]
})

backend.getInterpretation.resources.lambda.addToRolePolicy(statement);
