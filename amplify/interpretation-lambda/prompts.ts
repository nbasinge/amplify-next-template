export const enum PromptType {
    TO_EMOJIS = 1,
    EXPLAIN_EMOJI,
}

function emojiGenPrompt(content: string){
    let prompt = `
    interpret these emojis: ${content}
    `;
    return prompt;
}

function emojiExplainPrompt(content: string){
    let prompt = `
        
    interpret these emojis: ${content}
    
    * use conceise language
    * do not use the emoji in the sentence
    * do not use the word "emoji"
    * do not use the word "interpret"
    * do not use the word "meaning"
    * think abstractly, combining all of the emojis into a single consise concept.
    * Be abstract and creative and make things up and ponder what the emojis could represent. Not just face value.
    * For instance, a happy emoji, clapping emoji, and cowboy emoji could represent I am happy to receive recognition and applause for my hard work. 
    * Go all out with your interpretation. But not too lengthy. Keep it concise. 10 words at most.
    `;
    return prompt;
}

export function genPrompt(query: string, promptType: PromptType){
    if(promptType == PromptType.TO_EMOJIS){
        return emojiGenPrompt(query);
    }
    else if(promptType == PromptType.EXPLAIN_EMOJI){
        return emojiExplainPrompt(query);
    }
    else{
        return "happy emoji smilely face"
    }
}
