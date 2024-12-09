import OpenAI from "openai";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import type { Schema } from "../data/resource"
import type { AppSyncResolverHandler } from "aws-lambda";

const ssmClient = new SSMClient({});
const apiKey = await ssmClient.send(new GetParameterCommand({ Name: "openai-api-key", WithDecryption: true }))
    .then((data: any) => data.Parameter.Value);
const openai = new OpenAI({ apiKey });

export const handler: Schema["getInterpretation"]["functionHandler"] = async (event: any) => {
    console.log("event", event);
    const content = event.arguments.content;
    const prompt = `
    
    interpret these emojis: ${content}
    
    * use conceise language
    * do not use the emoji in the sentence
    * do not use the word "emoji"
    * Just explain in simple words, like "I am happy" or "I am sad about the wheater"
    
    `;
    
    const interpretation = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 128,
        temperature: 0.5,
        top_p: 1
    });
    console.log('interpretation', interpretation);
    const message = interpretation['choices'][0]['message']['content'] || 'unknown interpretation';
    console.log('message', message);
    const truncatedMessage = message.length > 40 ? message.substring(0, 100) : message;
    return truncatedMessage;
  };