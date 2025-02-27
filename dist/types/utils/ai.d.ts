declare class Ai {
    private ApiKey;
    constructor({ ApiKey }: {
        ApiKey: string;
    });
    generateResponse({ content, model }: {
        model?: string;
        content: string;
        role?: 'user' | 'system' | 'assistant';
    }): Promise<string[]>;
    summarizeText({ text, maxLength }: {
        text: string;
        maxLength: number;
    }): Promise<string>;
    translateText({ text, targetLanguage }: {
        text: string;
        targetLanguage: string;
    }): Promise<string>;
    generateCodeSnippet({ language, task }: {
        language: string;
        task: string;
    }): Promise<string>;
    answerQuestion({ question }: {
        question: string;
    }): Promise<string>;
    generateCreativeWriting({ prompt, genre }: {
        prompt: string;
        genre: string;
    }): Promise<string>;
}
export { Ai };
