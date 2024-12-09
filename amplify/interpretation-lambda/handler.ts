import OpenAI from "openai";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({});
const apiKey = await ssmClient.send(new GetParameterCommand({ Name: "openai-api-key", WithDecryption: true }))
    .then((data: any) => data.Parameter.Value);
const openai = new OpenAI({ apiKey });

export const handler = async (event: any) => {
    console.log("event", event);
    const content = event.content;
    const interpretation = await openai.chat.completions.create({
        model: "text-davinci-003",
        messages: [{ role: "user", content: `interpret these emojis: ${content}` }],
        max_tokens: 100
    });
    console.log('interpretation', interpretation);
    return {
        statusCode: 200,
        message: "Interpretation created",
        data: interpretation
    }
  };