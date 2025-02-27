"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ai = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function consoleError() {
    console.log('\x1b[31m%s\x1b[0m', '┌─────────────────────────────────────────────────┐');
    console.log('\x1b[31m%s\x1b[0m', '│                   ERROR In AI                   │');
    console.log('\x1b[31m%s\x1b[0m', '├─────────────────────────────────────────────────┤');
    console.log('\x1b[31m%s\x1b[0m', '│                Api Key are missing              ┤');
    console.log('\x1b[31m%s\x1b[0m', '└─────────────────────────────────────────────────┘');
}
class Ai {
    ApiKey;
    constructor({ ApiKey }) {
        this.ApiKey = ApiKey;
        if (!ApiKey) {
            consoleError();
            throw new Error("API key is required.");
        }
    }
    async generateResponse({ content, model }) {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.ApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: content.toString() }],
                    model: model || 'mixtral-8x7b-32768',
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, response: ${await response.text()}`);
            }
            const chatCompletion = await response.json();
            const responseMessage = chatCompletion.choices[0].message.content;
            const finalMessage = [];
            const limit = 2000;
            for (let i = 0; i < responseMessage.length; i += limit) {
                finalMessage.push(responseMessage.substring(i, i + limit));
            }
            return finalMessage;
        }
        catch (error) {
            console.error("Error in AI function:", error);
            throw error;
        }
    }
    async summarizeText({ text, maxLength }) {
        try {
            const response = await this.generateResponse({
                content: `Summarize the following text in ${maxLength} words or less: ${text}`,
                model: 'gemma-7b-it'
            });
            return response.join(' ');
        }
        catch (error) {
            console.error("Error in summarizeText function:", error);
            throw error;
        }
    }
    async translateText({ text, targetLanguage }) {
        try {
            const response = await this.generateResponse({
                content: `Translate the following text to ${targetLanguage}: ${text}`,
                model: 'gemma-7b-it'
            });
            return response.join(' ');
        }
        catch (error) {
            console.error("Error in translateText function:", error);
            throw error;
        }
    }
    async generateCodeSnippet({ language, task }) {
        try {
            const response = await this.generateResponse({
                content: `Generate a ${language} code snippet for the following task: ${task}`,
                model: 'gemma-7b-it'
            });
            return response.join('\n');
        }
        catch (error) {
            console.error("Error in generateCodeSnippet function:", error);
            throw error;
        }
    }
    async answerQuestion({ question }) {
        try {
            const response = await this.generateResponse({
                content: `Answer the following question: ${question}`,
                model: 'gemma-7b-it'
            });
            return response.join(' ');
        }
        catch (error) {
            console.error("Error in answerQuestion function:", error);
            throw error;
        }
    }
    async generateCreativeWriting({ prompt, genre }) {
        try {
            const response = await this.generateResponse({
                content: `Write a short ${genre} story based on the following prompt: ${prompt}`,
                model: 'gemma-7b-it'
            });
            return response.join('\n');
        }
        catch (error) {
            console.error("Error in generateCreativeWriting function:", error);
            throw error;
        }
    }
}
exports.Ai = Ai;
