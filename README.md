# djsify - The Ultimate AI-Powered Discord Bot Framework
Welcome to **djsify**, the cutting-edge framework designed to revolutionize the way you build Discord bots. With built-in support for **slash commands**, **message commands**, **button commands**, and powerful **AI enhancements** via Groq AI, this library offers unparalleled performance and ease of use. Whether you're building bots for fun or professional use, **djsify** simplifies the process with automation and smart defaults, while still offering deep customizability.

## Table of Contents

1. [Getting Started](#getting-started)
2. [New Update](#new-update)
3. [Features](#features)
4. [Installation](#installation)
5. [Quick Start](#quick-start)
6. [Configuration Options](#configuration-options)
7. [AI Integration](#ai-integration)
8. [Message Commands](#message-commands)
9. [Custom Colors](#custom-colors)
10. [TypeScript Support](#typescript-support)
11. [Contributing](#contributing)
12. [License](#license)

## Getting Started

djsify is designed for developers who want to build advanced Discord bots with minimal effort. By automating command handlers and supporting both JavaScript and TypeScript, the library provides out-of-the-box solutions for common bot functionality.

## New Update

1. you are know able to make a command with more then one alias

```javascript
import { Message } from "discord.js";
import { Ai } from "djsify";
const ai = new Ai({ ApiKey: "ApiKey" });
const AiAssistance = {
  data: {
    content: ["!ai", "!helpMe", "AiHelp"],
    startsWith: true,
  },
  /** @param {Message} message */
  async execute(message) {
    const response = await ai.generateResponse({
      content: message.content.replace("!ai", ""),
    });
    if (response.length === 1) {
      return message.reply({ content: response[0] });
    } else {
      for (const m of response) {
        return message.channel.send({ content: m });
      }
    }
  },
};
export default AiAssistance;
```

2. easier usage of ai !

```javascript
await ai.generateResponse({
  content: 'Make me a candy !',
});
await ai.generateCodeSnippet({
  language: "JS",
  task: "discord bot by djsify!",
});
await ai.answerQuestion({
  question: "how can I run djsify!",
});
await ai.summarizeText({
  maxLength: 5,
  text: "djsify is the best discord bot libirary manager based on discord.js!",
});
await ai.translateText({
  targetLanguage: "fr",
  text: "djsify loves you",
});
```
3. The bot Should response !

we added a feature that when you disabled for e.g Buttons
any button will reply with 'sorry buttons are not activated in this bot'


## Features

- **Automated Command Handling:** Automatically manages slash commands, message commands, and button commands.
- **Groq AI-Powered:** Seamlessly integrate advanced AI responses in your bot with Groq’s AI.
- **Smart Defaults:** Auto-detects and configures the most efficient settings for handling commands and events.
- **Message Command Flexibility:** Create message commands that support multiple configurations (`startsWith`, `includes`, `endsWith`).
- **TypeScript Ready:** Full support for TypeScript with types included.
- **Color Customization:** Predefined color constants for easy embedding customization.

## Installation

To install djsify, simply run the following command in your project directory:

```bash
npm install djsify
```

## Quick Start

Here’s how easy it is to get started with **djsify**. Below is a complete example of setting up the bot client and handling commands automatically.

```javascript
import { djsClient } from "djsify";

const { client } = new djsClient({
  token: "YOUR_DISCORD_BOT_TOKEN",
  buttonOn: true,
  slashCommandsOn: true,
  messageCommandsOn: true,
  buttonCommandDir: "./buttons", // Optional: auto-assigned to button_commands
  slashCommandDir: "./slash_commands", // Optional: auto-assigned to slash_commands
  messageCommandDir: "./messages", // Optional: auto-assigned to messages_commands
});
```
or in commonjs
```javascript
const { djsClient } = require("djsify");
const { client } = new djsClient({
  token: "YOUR_DISCORD_BOT_TOKEN",
  buttonOn: true,
  slashCommandsOn: true,
  messageCommandsOn: true,
  buttonCommandDir: "./buttons", // Optional: auto-assigned to button_commands
  slashCommandDir: "./slash_commands", // Optional: auto-assigned to slash_commands
  messageCommandDir: "./messages", // Optional: auto-assigned to messages_commands
});
```

That’s it! Your bot will now automatically handle and load commands from the respective directories.

### Configuration Options

| Option              | Type    | Description                                                                  |
| ------------------- | ------- | ---------------------------------------------------------------------------- |
| `token`             | String  | **Required**. Your Discord bot token.                                        |
| `buttonOn`          | Boolean | Enable or disable button commands. Default: `true`.                          |
| `slashCommandsOn`   | Boolean | Enable or disable slash commands. Default: `true`.                           |
| `messageCommandsOn` | Boolean | Enable or disable message commands. Default: `true`.                         |
| `buttonCommandDir`  | String  | Directory for button commands. Optional. Defaults to `./button_commands`.    |
| `slashCommandDir`   | String  | Directory for slash commands. Optional. Defaults to `./slash_commands`.      |
| `messageCommandDir` | String  | Directory for message commands. Optional. Defaults to `./messages_commands`. |

## AI Integration

One of the standout features of **djsify** is the seamless integration with Groq AI, enabling your bot to provide human-like responses. Here's how to set up AI in your bot:

```javascript
const { Ai } = require("djsify");
const ai = new Ai({ ApiKey: "YOUR_GROQ_API_KEY" });

module.exports = {
  data: {
    content: "!ai",
    startsWith: true,
  },
  async execute(message) {
    const response = await ai.generateResponse({
      content: message.content.replace("!ai", ""),
    });
    if (response.length === 1) {
      return message.reply({ content: response[0] });
    } else {
      for (const chunk of response) {
        await message.channel.send({ content: chunk });
      }
    }
  },
};
```

### Handling AI Response Length

Since Discord limits message length to 2000 characters, the AI response is automatically split into chunks. This ensures that even longer responses are handled gracefully.

## Message Commands

Message commands in **djsify** allow for advanced pattern matching and flexibility in how commands are detected. Here’s an example of a `hi` command that responds based on different conditions.

```javascript
const { Message } = require("discord.js");

module.exports = {
  data: {
    content: "hi",
    includes: true,
    startWith: false,
    endsWith: false,
  },
  async execute(message) {
    const args = message.content.split(" ");
    if (args[0] === "hi" && args[1] === "djs") {
      await message.reply("Hello world!");
    } else {
      return message.reply({ content: "I love you, world!" });
    }
  },
};
```

### Flexible Matching

You can control how your message command is triggered by configuring:

- **`startsWith`**: Whether the message must start with the command.
- **`includes`**: Whether the command is included anywhere in the message.
- **`endsWith`**: Whether the message ends with the command.

## Custom Colors

We provide a set of predefined colors to simplify the creation of embeds and UI customization for your bot. Here are the available colors:

```javascript
export const Colors = {
  Default: 0x000000,
  White: 0xffffff,
  Aqua: 0x1abc9c,
  Green: 0x57f287,
  Blue: 0x3498db,
  Yellow: 0xfee75c,
  Purple: 0x9b59b6,
  LuminousVividPink: 0xe91e63,
  Gold: 0xf1c40f,
  Orange: 0xe67e22,
  Red: 0xed4245,
  Grey: 0x95a5a6,
  Navy: 0x34495e,
  DarkAqua: 0x11806a,
  DarkGreen: 0x1f8b4c,
  DarkBlue: 0x206694,
  DarkPurple: 0x71368a,
  DarkGold: 0xc27c0e,
  DarkOrange: 0xa84300,
  DarkRed: 0x992d22,
  Blurple: 0x5865f2,
  Greyple: 0x99aab5,
};
```

You can easily use these color constants when building embeds.

## TypeScript Support

djsify has full support for TypeScript. Just follow these steps to use it with TypeScript:

1. Install TypeScript if you haven't already:

```bash
npm install typescript
```

2. Configure `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true
  }
}
```

3. Import and use djsify in your TypeScript project:

```typescript
import { djsClient } from "djsify";

const client = new djsClient({
  token: "YOUR_DISCORD_BOT_TOKEN",
  buttonOn: true,
  slashCommandsOn: true,
  messageCommandsOn: true,
});
```

## Contributing

We welcome contributions from the community! If you have suggestions, bug fixes, or new features, feel free to open a pull request or submit an issue on our GitHub repository.

### How to Contribute

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Make your changes and commit them.
4. Push to your fork and create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

By following this guide, you'll be able to unlock the full potential of **djsify** and quickly develop Discord bots that stand out with AI-driven capabilities and modern design. Happy coding! 😎


## Last update

Added functions 

1- Reload() : to reload the bot.

2- setStatus() : to set the bot status.

3- setActivity() : to set the bot activity.

4- allowDm() : to allow the bot to send messages in DMs or disallow it.

5- PrivateBot : to make the bot private or public.

and more...