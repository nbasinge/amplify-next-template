import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { interpretationLambda } from './interpretation-lambda/resource';

defineBackend({
  auth,
  data,
  interpretationLambda
});
