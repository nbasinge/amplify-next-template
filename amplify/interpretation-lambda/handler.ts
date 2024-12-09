import OpenAI from "openai";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import type { Schema } from "../data/resource"
import type { AppSyncResolverHandler } from "aws-lambda";

const ssmClient = new SSMClient({});
const apiKey = await ssmClient.send(new GetParameterCommand({ Name: "openai-api-key", WithDecryption: true }))
    .then((data: any) => data.Parameter.Value);
const openai = new OpenAI({ apiKey });

export const handler: AppSyncResolverHandler<{ content?: string }, { statusCode: number; message: string; data: any } | null> = async (event) => {
    console.log("event", event);
    const content = event.arguments.content;
    const interpretation = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `interpret these emojis: ${content}` }],
        max_tokens: 128,
        temperature: 0.5,
        top_p: 1
    });
    console.log('interpretation', interpretation);
    const message = interpretation['choices'][0]['message']['content'];
    console.log(interpretation['choices'][0]['message']['content'])
    return message;
  };