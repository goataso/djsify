# 🎮 djsify - The Ultimate AI-Powered Discord Bot Framework

![Version](https://img.shields.io/npm/v/djsify)
![License](https://img.shields.io/npm/l/djsify)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

djsify makes it super easy to create Discord bots. It's built on Discord.js and adds AI features to make your bot smarter. Whether you're just starting out or you've been coding for a while, djsify helps you make awesome Discord bots without all the complicated stuff.
  ## 📋 Table of Contents
  - [🌟 Main Features](#-main-features)
  - [📥 Installation](#-installation)
  - [🚀 Quick Start](#-quick-start)
  - [📊 Core Classes](#-core-classes)
    - [Bot Client](#djsclient-class)
    - [AI Features](#ai-class)
    - [Command Handlers](#command-classes)
  - [💬 Message Commands](#-message-commands)
  - [⚡ Slash Commands](#-slash-commands)
  - [🔘 Button Commands](#-button-commands)
  - [🔄 Pre-command Hooks](#-pre-Command-Hooks)
  - [🧠 AI Integration](#-ai-integration)
  - [🎨 Styling & Colors](#-styling-with-colors)
  - [⚙️ Configuration](#️-advanced-configuration)
  - [🌐 Private Bot Mode](#-private-bot-mode)
  - [📜 TypeScript Support](#-typescript-support)
  - [📚 Code Examples](#-examples)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🌟 Main Features

- **Different Command Types**: Use slash commands, text commands, and buttons all in one bot
- **AI Brain**: Built-in AI powered by Groq to help your bot understand and create text
- **Easy File Setup**: Your commands are automatically found and set up from folders
- **Smart Message Reading**: Bot can respond to messages in different ways
- **Smart Responses**: Long AI responses are automatically split into smaller messages
- **Multiple Names**: Use different words to trigger the same command
- **Easy Colors**: Ready-to-use colors to make your bot's messages look good
- **Quick Changes**: Change how your bot works without turning it off
- **Works with TypeScript**: Everything is ready for TypeScript if you want to use it
- **Simple to Start**: Get your bot working with just a few lines of code## 📥 Installation

Install djsify using your package manager of choice:

```bash
# Using npm
npm install djsify

# Using yarn
yarn add djsify

# Using pnpm
pnpm add djsify
```

Make sure you have Node.js 16.9.0 or newer installed.

## 🚀 Quick Start

Getting started with djsify is incredibly simple:

```javascript

import { djsClient } from "djsify";

const { client } = new djsClient({
  token: "YOUR_DISCORD_BOT_TOKEN",

  buttonOn: true,
  slashCommandsOn: true,
  messageCommandsOn: true,
});

```

## 📊 Core Classes

### djsClient Class

The `djsClient` class is the main entry point for your bot:

```typescript

const { client } = new djsClient({
  token: string,               
  buttonOn?: boolean,          
  slashCommandsOn?: boolean,   
  messageCommandsOn?: boolean, 
  buttonCommandDir?: string,   
  slashCommandDir?: string,    
  messageCommandDir?: string,
  isPrivateBot?: boolean,
  allowedGuilds: string | string[] | null // will only be working if isPrivateBot is true
});
```

**Available Methods:**

```javascript

client.reload();

client.setStatus("online");

client.setActivity("with djsify", "PLAYING");

client.allowDm(true);

client.addAllowedGuilds(["GUILD_ID_1", "GUILD_ID_2"]);

const allowedGuilds = client.getAllowedGuilds();

client.setButtonCommandsDir("./custom/buttons");
client.setSlashCommandDir("./custom/commands");
client.setMessageCommandDir("./custom/messages");
```

### Ai Class

The `Ai` class provides AI capabilities via Groq:

```javascript
import { Ai } from "djsify";

const ai = new Ai({ ApiKey: "YOUR_GROQ_API_KEY" });
```

**Available AI Methods:**

```javascript

const response = await ai.generateResponse({
  content: "Tell me about Discord bots"
});

const code = await ai.generateCodeSnippet({
  language: "JavaScript",
  task: "Create a Discord bot using djsify"
});

const answer = await ai.answerQuestion({
  question: "How do I create a slash command with djsify?"
});

const summary = await ai.summarizeText({
  maxLength: 5, 
  text: "Long text to summarize..."
});

const translation = await ai.translateText({
  targetLanguage: "French",
  text: "Hello world"
});

const story = await ai.generateCreativeWriting({
  prompt: "A story about a Discord bot that becomes sentient"
});
```

### Command Classes

djsify provides specialized classes for each command type:

```javascript

import { 
  SlashCommandFile, 
  MessageCommandFile, 
  ButtonCommandFile 
} from "djsify";

```

## 💬 Message Commands

Message commands are triggered by regular text messages in Discord channels.

**Basic Message Command:**

```javascript
import { MessageCommandFile } from "djsify";
import { Message } from "discord.js";

const Command = {
  data: {
    content: "hello", 
    startsWith: true, 
  },
  execute: async (message) => {
    await message.reply("Hello there!");
  }
};

export default Command;

**Multiple Trigger Patterns:**

import { MessageCommandFile } from "djsify";

const Command = {
  data: {
    content: ["hi", "hello", "hey"], 
    startsWith: true,                
    includes: false,                 
    endsWith: false,                 
  },
  execute: async (message) => {
    await message.reply("Greetings!");
  }
};

export default Command;
```

**Command with Arguments:**

```javascript

import { MessageCommandFile } from "djsify";

const Command = {
  data: {
    content: "!repeat",
    startsWith: true,
  },
  execute: async (message) => {
    const args = message.content.replace("!repeat", "").trim();
    if (!args) {
      return message.reply("Please provide something for me to repeat!");
    }
    await message.reply(`You said: ${args}`);
  }
};

export default Command;
```
## ⚡ Slash Commands

Slash commands let users interact with your bot using / commands.

**Basic Slash Command:**
```javascript
import { SlashCommandFile } from "djsify";

const Command = {
  data: {
    name: "ping",
    description: "Replies with the bot's latency"
  },
  execute: async (interaction) => {
    const latency = interaction.client.ws.ping;
    await interaction.reply(`Pong! Latency: ${latency}ms`);

    // you can reach also djsClient instance by
    interaction.djsClient
    // which allows you to change settings and using functionality without reloading
  }
};

export default Command;
```
**Slash Command with Options:**
```javascript
import { SlashCommandFile } from "djsify";
import { OptionType } from "djsify";

const Command = {
  data: {
    name: "echo",
    description: "Echoes your message",
    options: [
      {
        name: "message",
        description: "The message to echo back",
        type: OptionType.STRING,
        required: true
      },
      {
        name: "ephemeral",
        description: "Whether the reply should be private",
        type: OptionType.BOOLEAN,
        required: false
      }
    ]
  },
  execute: async (interaction) => {
    const message = interaction.options.getString("message");
    const ephemeral = interaction.options.getBoolean("ephemeral") || false;

    await interaction.reply({
      content: `Echo: ${message}`,
      ephemeral: ephemeral
    });
  }
};

export default Command;
```
## 🔘 Button Commands

Button commands let your bot respond when users click buttons.

**Basic Button Command:**
```javascript
import { ButtonCommandFile } from "djsify";

const Command = {
  data: {
    customId: "confirm", 
    startsWith: true,    
  },
  execute: async (interaction) => {
    await interaction.reply("Action confirmed!");
  }
};

export default Command;
```
**Button Command with Dynamic ID:**
```javascript
import { ButtonCommandFile } from "djsify";

const Command = {
  data: {
    customId: "delete_",   
    startsWith: true,      
    includes: false,
    endsWith: false
  },
  execute: async (interaction) => {

    const messageId = interaction.customId.replace("delete_", "");

    try {

      const channel = interaction.channel;
      const message = await channel.messages.fetch(messageId);
      await message.delete();

      await interaction.reply({
        content: "Message deleted!",
        flags: 64
      });
    } catch (error) {
      await interaction.reply({
        content: "Failed to delete message!",
        flags: 64
      });
    }
  }
};

export default Command;
```
## 🔄 Pre-command Hooks

The preCommandHook option allows you to execute functions before commands are executed. You can use callbacks to pass interaction objects and parameters to commands as needed.

```javascript
import { djsClient } from "djsify";

const client = new djsClient({
    token: "YOUR_BOT_TOKEN",
    preCommandHook: {
      button: (buttonInteraction, callback) => {
        console.log(`Button interaction received: ${buttonInteraction.customId}`);
        callback(buttonInteraction);
      },
      message: (message, callback) => {
        const args = message.content.trim().split(/\s+/);
        console.log(`Message command received: ${args[0]}`);
        callback(message, args);
      },
      ready: () => {
        console.log('Bot is online and ready!');
      },
      slashCommand: (interaction, callback) => {
        console.log(`Slash command received: ${interaction.commandName}`); 
        callback(interaction);
      }
    }
});
```

## 
## 🧠 AI Integration

Use AI to make your bot smarter with Groq integration.

**AI Chat Command:**
```javascript
import { Ai, MessageCommandFile } from "djsify";
import { Message } from "discord.js";

const ai = new Ai({ ApiKey: "YOUR_GROQ_API_KEY" });

const Command = {
  data: {
    content: ["!chat", "!ask", "!ai"],
    startsWith: true,
  },
  execute: async (message) => {

    const commandUsed = message.content.split(" ")[0];
    const query = message.content.replace(commandUsed, "").trim();

    if (!query) {
      return message.reply("Please ask me a question!");
    }

    message.channel.sendTyping();

    try {
      const response = await ai.generateResponse({
        content: query
      });

      if (response.length === 1) {
        await message.reply(response[0]);
      } else {
        await message.reply("Here's my response:");
        for (const chunk of response) {
          await message.channel.send(chunk);
        }
      }
    } catch (error) {
      await message.reply("Sorry, I couldn't answer right now.");
    }
  }
};

export default Command;
```
**AI Code Generator:**
```javascript
import { Ai, SlashCommandFile } from "djsify";
import { OptionType } from "djsify";
import { EmbedBuilder } from "discord.js";

const ai = new Ai({ ApiKey: "YOUR_GROQ_API_KEY" });

const Command = {
  data: {
    name: "code",
    description: "Generate code snippets using AI",
    options: [
      {
        name: "language",
        description: "The programming language",
        type: OptionType.STRING,
        required: true,
        choices: [
          { name: "JavaScript", value: "JavaScript" },
          { name: "Python", value: "Python" },
          { name: "Java", value: "Java" },
          { name: "C#", value: "C#" },
          { name: "HTML/CSS", value: "HTML/CSS" }
        ]
      },
      {
        name: "task",
        description: "Description of what the code should do",
        type: OptionType.STRING,
        required: true
      }
    ]
  },
  execute: async(interaction) => {
    await interaction.deferReply();

    const language = interaction.options.getString("language");
    const task = interaction.options.getString("task");

    try {
      const code = await ai.generateCodeSnippet({
        language: language,
        task: task
      });

      const embed = new EmbedBuilder()
        .setTitle(`${language} Code`)
        .setDescription(`\`\`\`${language.toLowerCase()}\n${code}\n\`\`\``)
        .setColor("#5865F2")
        .setFooter({ text: "Generated with Groq AI" });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply("Sorry, I couldn't generate the code right now.");
    }
  }
};

export default Command;
```
## 🎨 Styling with Colors

djsify includes a rich set of predefined colors for embeds:

```javascript
import { Colors } from "djsify";
import { EmbedBuilder } from "discord.js";

const embed = new EmbedBuilder()
  .setTitle("Welcome to my Server!")
  .setDescription("Thanks for joining us!")
  .setColor(Colors.Blurple);

const allColors = {
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

## ⚙️ Advanced Configuration

**Customizing Command Directories:**

```javascript

const { client } = new djsClient({
  token: "YOUR_DISCORD_BOT_TOKEN",
  buttonCommandDir: "./buttons",
  slashCommandDir: "./commands",
  messageCommandDir: "./messages",
  buttonOn: true, // must be true to use custom directories
  slashCommandsOn: true, // must be true to use custom directories
  messageCommandsOn: true, // must be true to use custom directories
});

client.setButtonCommandsDir("./src/buttons");
client.setSlashCommandDir("./src/commands");
client.setMessageCommandDir("./src/messages");
```

**Disabling Features:**

```javascript

const { client } = new djsClient({
  token: "YOUR_DISCORD_BOT_TOKEN",
  buttonOn: false,         
  slashCommandsOn: true,   
  messageCommandsOn: false, 
});
```

**Runtime Bot Management:**

```javascript

client.setStatus("dnd"); 

client.setActivity("with djsify v1", "PLAYING");

client.reload();

client.allowDm(false); 
```

## 🌐 Private Bot Mode

Make your bot exclusive to specific servers:

```javascript

client.addAllowedGuilds([
  "123456789012345678",  // server ID's 
  "876543210987654321"  // As an array
]);
/**
 * @type {string[]}
 */
const allowedGuilds = client.getAllowedGuilds();
```

can we add a guildId in runtime ?
** yes ! **
```typescript
import { OptionType } from 'djsify';
const Command = {
  data: {
    name: 'add-guild',
    description: 'to add a guildId to the allowedGuilds array in runtime',
    options: [
      {
        name: 'guildId',
        description: 'The guildId to add',
        type: OptionType.STRING,
        required: true
      }
    ]
  },
  async execute(interaction: CommandInteraction): Promise<void> {
    const guildId = interaction.options.getString('guildId');
    if (interaction.djsClient) {
      interaction.djsClient.addAllowedGuilds(guildId); // function supports array and string
    };
    await interaction.reply({ content: `Guild ID ${guildId} added to the allowedGuilds array.`, flags: 64 });
  }
}
```

## 📜 TypeScript Support

djsify provides first-class TypeScript support:

```typescript
import { djsClient, Ai, SlashCommandFile, MessageCommandFile, ButtonCommandFile } from "djsify";
import { Message, CommandInteraction, ButtonInteraction } from "discord.js";
import { OptionType } from "djsify";

const { client } = new djsClient({
  token: process.env.BOT_TOKEN as string,
  buttonOn: true,
  slashCommandsOn: true,
  messageCommandsOn: true,

});

const ai = new Ai({ ApiKey: process.env.GROQ_API_KEY as string });

const response = await ai.generateResponse({ content: "Hello" });

const Command = {
  data: {
    name: "ping",
    description: "Pong!"
  },
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
  }
};

export default Command;
```

## 📚 Examples

**Creating an AI-powered Help Command:**

```javascript

import { SlashCommandFile, Ai } from "djsify";

const ai = new Ai({ ApiKey: "YOUR_GROQ_API_KEY" });

const Command = {
  data: {
    name: "help",
    description: "Get help with bot commands",
    options: [
      {
        name: "command",
        description: "Specific command to get help with",
        type: 3, 
        required: false
      }
    ]
  },
  execute: async (interaction) => {
    const command = interaction.options.getString("command");

    if (command) {

      const response = await ai.answerQuestion({
        question: `How do I use the "${command}" command in this Discord bot?`
      });

      await interaction.reply(response);
    } else {

      const commands = interaction.client.application.commands.cache;
      let helpText = "**Available Commands:**\n\n";

      commands.forEach(cmd => {
        helpText += `**/${cmd.name}** - ${cmd.description}\n`;
      });

      await interaction.reply(helpText);
    }
  }
};

export default Command;
```

**Multi-Function Bot with Various Command Types:**

```javascript

import { SlashCommandFile } from "djsify";
import { OptionType } from "djsify";
import { EmbedBuilder } from "discord.js";

const Command = {
  data: {
    name: "profile",
    description: "View a user's profile",
    options: [
      {
        name: "user",
        description: "The user to view",
        type: OptionType.USER,
        required: false
      }
    ]
  },
  execute: async (interaction) => {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Profile`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "Joined Server", value: new Date(member.joinedAt).toLocaleDateString() },
        { name: "Account Created", value: new Date(user.createdAt).toLocaleDateString() },
        { name: "Roles", value: member.roles.cache.map(r => r.name).join(", ") }
      )
      .setColor("#5865F2");

    await interaction.reply({ embeds: [embed] });
  }
};

export default Command;
```

## 🤝 Contributing

We welcome contributions to the djsify project! See [CONTRIBUTING.md](./CONTRIBUTERS.md) for details on how to get involved.

## 📄 License

djsify is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.

---

## Changelog
v 1.7.0
1- Added onEvent options
2- Added better types and flexibility
3- improved perforamance

for more information please see [CHANGELOG](./CHANGELOG.md)

Built with ❤️ for Discord bot developers everywhere. Happy coding!
