import { defineFunction } from "@aws-amplify/backend";
    
export const interpretationLambda = defineFunction({
  name: "interpretation-lambda",
  entry: "./handler.ts"
});