"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/setup.ts
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const version = "1.0.0";
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
program
    .name("DJSify")
    .description("CLI to build discord.js commands")
    .version("1.0.0");
program
    .command("--v")
    .description("Display discord.js version")
    .action(() => {
    console.log(`DJSify version: ${version}`);
});
program
    .command("build")
    .description("to Start your bot")
    .action(() => {
    const directory = process.cwd();
    console.log(`Starting your bot...`);
    let config;
    try {
        config = JSON.parse(fs_1.default.readFileSync(`${directory}/config.djs.json`, 'utf8'));
    }
    catch {
        return console.log('the workspace doesnt have a build file');
    }
    const { type } = config;
    const { exec } = require("child_process");
    if (!type || type.toLowerCase() === 'js') {
        exec('node .', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing tsc: ${error.message}`);
                console.error(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log("Bot started successfully.");
        });
        return;
    }
    exec("npx tsc", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing tsc: ${error.message}`);
            console.error(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log("TypeScript compilation completed.");
        console.log(`stdout: ${stdout}`);
        exec("cd dist && node .", (error) => {
            if (error) {
                console.error(`Error executing node: ${error.message}`);
                return;
            }
            console.log("Bot started successfully.");
        });
    });
});
program
    .command("createButton <buttonCustomId>")
    .description("Create a new button")
    .action((buttonCustomId) => {
    console.log(`Creating button with custom ID: ${buttonCustomId}`);
    const currentDirectory = process.cwd();
    const content = `import { ButtonInteraction } from 'discord.js';

export default {
  data: {
    customId: "${buttonCustomId}"
  },
  async execute(interaction: ButtonInteraction) {
    // Your code here
  }
};`;
    try {
        fs_1.default.existsSync(currentDirectory + "/buttons") ||
            fs_1.default.mkdirSync(currentDirectory + "/buttons");
        fs_1.default.writeFileSync(path_1.default.join(currentDirectory, "buttons", `${buttonCustomId}.ts`), content);
        console.log(`Done creating button file with ${buttonCustomId} id`);
    }
    catch (error) {
        console.error("Error creating button file:", error);
    }
});
program
    .command("createSlash")
    .description("Create a new slash command")
    .action(() => {
    inquirer_1.default.prompt(questionsSlash).then((answers) => {
        const commandName = answers.commandName;
        const commandDescription = answers.commandDescription;
        const currentDirectory = process.cwd();
        const file = JSON.parse(fs_1.default.readFileSync(currentDirectory + "/config.djs.json", "utf8"));
        const commandType = answers.commandType.toUpperCase();
        let type;
        if (commandType === "I DONT WANT") {
            type = "none";
        }
        else {
            type = commandType;
        }
        const { type: language } = file;
        const commandFile = `${language === "TS"
            ? `import { CommandInteraction } from 'discord.js';`
            : 'const { CommandInteraction } = require("discord.js");'}
${language === "TS"
            ? `import { OptionType , SlashCommandBuilder} from 'DJSify'`
            : 'const { OptionType, SlashCommandBuilder } = require("DJSify")'}    
module.exports = {
  data: new SlashCommandBuilder()
      .setName('${commandName}')
      .setDescription('${commandDescription}')
      ${type !== "none"
            ? `.addOption({
        name : "your_option_name",
        description : "your option description",
        type : OptionType.${type},
        required : true
        })`
            : ""},
      ${language == "JS"
            ? '/** @param {import("discord.js").Interaction} interaction */'
            : ""}
  async execute(interaction ${language == "TS" ? ": CommandInteraction" : ""}) {
      // Command execution logic here
  }
};
`;
        fs_1.default.writeFileSync(currentDirectory +
            `/commands/${commandName}.${language.toLowerCase()}`, commandFile);
        console.log(`Slash command created successfully: /${commandName}`);
    });
});
const questionsSlash = [
    {
        type: "input",
        name: "commandName",
        message: "Enter your command name:",
        required: true,
    },
    {
        type: "input",
        name: "commandDescription",
        message: "Enter your command description:",
        required: true,
    },
    {
        type: "list",
        name: "commandType",
        message: "Enter its type (not required)",
        choices: [
            "I dont want",
            "string",
            "integer",
            "number",
            "boolean",
            "user",
            "channel",
            "role",
            "mentionable",
            "attachment",
            "subcommand",
            "subcommandgroup",
        ],
    },
];
const questions = [
    {
        type: "list",
        name: "js / ts",
        message: "Choose your setup language",
        choices: ["JS", "TS"],
    },
    {
        type: "confirm",
        name: "buttonOn",
        message: "Enable buttons?",
        default: true,
    },
    {
        type: "confirm",
        name: "slashCommandsOn",
        message: "Enable slash commands?",
        default: true,
    },
    {
        type: "confirm",
        name: "messageOn",
        message: "Enable advanced message handling?",
        default: true,
    },
    {
        type: "input",
        name: "bot_token",
        message: "Enter your bot token:",
    },
];
program
    .command("setup")
    .description("setup your bot environment")
    .action(() => {
    inquirer_1.default
        .prompt(questions)
        .then(async (answers) => {
        const typeLanguage = answers["js / ts"];
        const buttonOn = answers.buttonOn;
        const slashCommandsOn = answers.slashCommandsOn;
        const botToken = answers.bot_token;
        const messageOn = answers.messageOn;
        const currentDirectory = process.cwd();
        const data = {
            type: typeLanguage,
            buttonOn: true,
            slashCommandsOn: true,
            botToken: botToken,
            features: {
                advancedMessageHandling: true,
                customEmbedsSupport: true,
                interactiveComponents: true,
                voiceChannelIntegration: true,
                multiServerSupport: true,
                databaseIntegration: true,
                webhookManagement: true,
                autoModeration: true,
                customCommandCreation: true,
                roleManagement: true,
            },
            performance: {
                optimizedCaching: true,
                asyncProcessing: true,
                lowLatencyResponses: true,
            },
            security: {
                encryptedDataStorage: true,
                rateLimiting: true,
                antiSpamProtection: true,
            },
            analytics: {
                userActivityTracking: true,
                commandUsageStatistics: true,
                performanceMetrics: true,
            },
            customization: {
                theming: true,
                localization: true,
            },
            version: "2.0.0",
            codename: "DJSify",
        };
        let code;
        if (typeLanguage === "JS") {
            code = `import { djsClient } from 'djsify';
const { client } = new djsClient({
    token: '',
    buttonOn: true,
    slashCommandsOn: true,
    messageCommandsOn : true,
    ButtonCommandDir : '/buttons', // not required
    slashCommandDir : '/commands', // not required
    messageCommandDir : '/messages' // not required
});
/* thats all you shouldnt do any thing else editing in the created folders
${slashCommandsOn ? "/slash_commands" : ""}
${buttonOn ? "/buttons" : ""}
${messageOn ? "/messages" : ""}
*/`;
        }
        else if (typeLanguage === "TS") {
            code = `import { djsClient } from 'DJSify';
const { client } = new djsClient({
    token: '',
    buttonOn: true,
    slashCommandsOn: true,
    messageCommandsOn : true,
    buttonCommandDir : '/buttons', // not required
    slashCommandDir : '/commands', // not required
    messageCommandDir : '/messages' // not required
});
// you can use client in any other interactions or messages
// for e.g
client.once('ready', () => {
  console.log('I Love DJSify');
});
/* thats all you shouldnt do any thing else editing in the created folders
${slashCommandsOn ? "/slash_commands" : ""}
${buttonOn ? "/buttons" : ""}
${messageOn ? "/messages" : ""}
        */`;
            //fs.existsSync(`${process.cwd()}/commands`) || fs.mkdirSync(`${process.cwd()}/commands`)
            //fs.existsSync(`${process.cwd()}/messages`) || fs.mkdirSync(`${process.cwd()}/messages`)
            //fs.existsSync(`${process.cwd()}/buttons`) || fs.mkdirSync(`${process.cwd()}/buttons`)
        }
        else {
            code = "";
        }
        if (buttonOn && !fs_1.default.existsSync(`${currentDirectory}/buttons`)) {
            fs_1.default.mkdirSync(currentDirectory + "/buttons");
        }
        if (slashCommandsOn &&
            !fs_1.default.existsSync(`${currentDirectory}/commands`)) {
            fs_1.default.mkdirSync(currentDirectory + "/commands");
        }
        if (messageOn && !fs_1.default.existsSync(`${currentDirectory}/messages`)) {
            fs_1.default.mkdirSync(currentDirectory + "/messages");
        }
        fs_1.default.writeFileSync(currentDirectory + "/config.djs.json", JSON.stringify(data, null, 4));
        fs_1.default.writeFileSync(currentDirectory + `/index.${typeLanguage.toLowerCase()}`, code);
        const { MessageFileJS, MessageFileTS, buttonFile, buttonFileTS, commandFile, commandFileTS, tsConfig, } = await createSampleFiles();
        fs_1.default.writeFileSync(currentDirectory + `/buttons/djs.${typeLanguage.toLowerCase()}`, typeLanguage.toLowerCase() === "js" ? buttonFile : buttonFileTS);
        fs_1.default.writeFileSync(currentDirectory + `/slash_commands/ping.${typeLanguage.toLowerCase()}`, typeLanguage.toLowerCase() === "js" ? commandFile : commandFileTS);
        fs_1.default.writeFileSync(currentDirectory + `/messages/helloWorld.${typeLanguage.toLowerCase()}`, typeLanguage.toLowerCase() === "js" ? MessageFileJS : MessageFileTS);
        if (typeLanguage.toLowerCase() === "ts") {
            fs_1.default.writeFileSync(currentDirectory + `/tsconfig.json`, tsConfig);
        }
        console.log(`done setuping everything`);
        console.log(`> you can run this application using djs build`);
    })
        .catch((error) => {
        if (error.isTtyError) {
            console.log("Prompt couldn't be rendered in the current environment");
        }
        else if (error.name === "ExitPromptError") {
            console.log("User exited the prompt");
        }
        else {
            console.log("An error occurred:", error);
        }
    })
        .finally(() => {
        process.exit(0);
    });
});
program.parse(process.argv);
process.on("SIGINT", () => {
    console.log("\nExiting...");
    process.exit(0);
});
async function createSampleFiles() {
    const description = "`The bot ${pingType || 'API'} ping is ${pingType === 'ws' ? interaction.client.ws.ping : apiPing}ms`";
    const buttonFile = `module.exports = {
    data : {
        customId: 'djs-builder'
    },
    async execute(interaction) {
        await interaction.reply('Hello World!');
    }
}`;
    const commandFile = `import { Colors ,SlashCommand  } from 'djsify';

module.exports = {
    data: new SlashCommand()
        .setName('ping')
        .setDescription('Replies with "Pong!"')
        .addOption({
            name : 'type',
            description : 'type',
            type : 'STRING',
            required : false,
            choices : [
                {
                    name: 'ws',
                    value: 'ws'
                },
                {
                    name: 'api',
                    value: 'api'
                }
            ]
        }),
    /** @param {import('discord.js').Interaction} interaction */
    async execute(interaction) {
        const pingType = interaction.options.get('type')?.value;
        const date = Date.now();
        await interaction.deferReply();
        const date2 = Date.now();
        const apiPing = date2 - date;
        const embed = {
            title: 'Ping',
            description: ${description},
            color: Colors.Aqua        };
        if (interaction.isRepliable()) {
            await interaction.editReply({ embeds: [embed] });
        }
    }
};

`;
    const commandFileTS = `const { Colors ,SlashCommand  } = require('djsify');
module.exports = {
    data: new SlashCommand()
        .setName('ping')
        .setDescription('Replies with "Pong!"')
        .addOption({
            name : 'type',
            description : 'type',
            type : 'STRING',
            required : false,
            choices : [
                {
                    name: 'ws',
                    value: 'ws'
                },
                {
                    name: 'api',
                    value: 'api'
                }
            ]
        }),
    /** @param {import('discord.js').Interaction} interaction */
    async execute(interaction) {
        const pingType = interaction.options.get('type')?.value;
        const date = Date.now();
        await interaction.deferReply();
        const date2 = Date.now();
        const apiPing = date2 - date;
        const embed = {
            title: 'Ping',
            description: ${description},
            color: Colors.Aqua
        };
        if (interaction.isRepliable()) {
            await interaction.editReply({ embeds: [embed] });
        }
    }
};


export default command;`;
    const buttonFileTS = `import { ButtonInteraction } from "discord.js";

export default {
    data: {
        customId: 'djs'
    },
    async execute(interaction: ButtonInteraction) {
        await interaction.reply({ content: "Button clicked!" });
    }
}`;
    const MessageFileTS = `import { Message } from "discord.js";

export default {
    data: {
        content: 'hi',
        includes: true,
        //startsWith: true, other arguments
        //endsWith: true,  other arguments
    },
    async execute(message: Message): Promise<void> {
        const args = message.content.split(" ");
        if (args[0] === 'hi' && args[1] === 'djs') {
            await message.reply('Hello world!');
        }
    }
}`;
    const MessageFileJS = `const { Message } = require("discord.js");

module.exports = {
    data : {
        content : 'hi',
        includes : true,
        //startsWith : true, other arguments
        //endsWith : true,  other arguments
    },
    /** @param {Message} message */
    async execute(message){
        const args = message.content.split(" ");
        if(args[0] === 'hi' && args[1] === 'djs'){
            await message.reply('Hello world!');
        }
    }
}`;
    const tsConfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./",
    "resolveJsonModule": true,
    "noImplicitAny": true
  },
  "include": [
    "./index.ts",
    "./slash_commands/**/*",
    "./messages/**/*",
    "./buttons/**/*"
  ],
  "exclude": ["node_modules", "**/*.test.ts"]
}
`;
    return {
        MessageFileJS,
        MessageFileTS,
        commandFile,
        commandFileTS,
        buttonFile,
        buttonFileTS,
        tsConfig,
    };
}
