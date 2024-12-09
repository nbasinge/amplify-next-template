import { defineFunction } from "@aws-amplify/backend";
    
export const getInterpretation = defineFunction({
  name: "interpretation-lambda",
  entry: "./handler.ts",
});
