// 
import SlashType from "./type/SlashType.js";
import { ButtonInteraction, CommandInteraction, Message } from "discord.js";
import { OptionType } from "./builders/SlashCommand.js";

declare module 'djsify1' {
  export class Ai {
    constructor(apiKey: string);

    answerQuestion(question: string): Promise<string>;
    generateCodeSnippet(language: string, description: string): Promise<string>;
    generateCreativeWriting(prompt: string): Promise<string>;
    generateResponse(query: string): Promise<string>;
    summarizeText(text: string): Promise<string>;
    translateText(text: string, targetLanguage: string): Promise<string>;
  }

  export class SlashCommand {
    constructor(name: string, description: string);

    addOption(name: string, type: OptionType, description: string): void;
    setDescription(description: string): void;
    setName(name: string): void;
    toJSON(): object;
  }

  export class djsClient {
    constructor(token: string);

    addAllowedGuilds(guildIds: string[]): void;
    getAllowedGuilds(): string[];
    reload(): void;
    setActivity(activity: string, type: string): void;
    setButtonCommandsDir(path: string): void;
    setMessageCommandDir(path: string): void;
    setSlashCommandDir(path: string): void;
    setStatus(status: string): void;
  }

  export const Colors: {
    Aqua: number;
    Blue: number;
    Blurple: number;
    DarkAqua: number;
    DarkBlue: number;
    DarkButNotBlack: number;
    DarkGold: number;
    DarkGreen: number;
    DarkGrey: number;
    DarkNavy: number;
    DarkOrange: number;
    DarkPurple: number;
    DarkRed: number;
    DarkVividPink: number;
    DarkerGrey: number;
    Default: number;
    Fuchsia: number;
    Gold: number;
    Green: number;
    Grey: number;
    Greyple: number;
    LightGrey: number;
    LuminousVividPink: number;
    Navy: number;
    NotQuiteBlack: number;
    Orange: number;
    Purple: number;
    Red: number;
    White: number;
    Yellow: number;
  };

  export const OptionType: {
    "1": string;
    "10": string;
    "11": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    "6": string;
    "7": string;
    "8": string;
    "9": string;
    ATTACHMENT: number;
    BOOLEAN: number;
    CHANNEL: number;
    INTEGER: number;
    MENTIONABLE: number;
    NUMBER: number;
    ROLE: number;
    STRING: number;
    SUBCOMMAND: number;
    SUBCOMMAND_GROUP: number;
    USER: number;
  };

  export class ButtonCommandFile {
    constructor(
      data: {
        customId: string;
        startsWith: boolean;
        includes: boolean;
        endsWith: boolean;
      },
      execute: (interaction: ButtonInteraction) => Promise<void> | void
    );
    data: {
      customId: string;
      startsWith: boolean;
      includes: boolean;
      endsWith: boolean;
    };
    execute: (interaction: ButtonInteraction) => Promise<void> | void;
  }

  export class MessageCommandFile {
    constructor(
      data: {
        content: string | string[];
        startsWith?: boolean;
        includes?: boolean;
        endsWith?: boolean;
      },
      execute: (message: Message) => Promise<void> | void
    );
    data: {
      content: string | string[];
      startsWith?: boolean;
      includes?: boolean;
      endsWith?: boolean;
    };
    execute: (message: Message) => Promise<void> | void;
  }

  export class SlashCommandFile {
    constructor(
      data: SlashType,
      execute: (interaction: CommandInteraction) => Promise<void> | void
    );
    data: SlashType;
    execute: (interaction: CommandInteraction) => Promise<void> | void;
  }
}
