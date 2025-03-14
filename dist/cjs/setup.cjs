"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/setup.ts
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const node_path_1 = __importDefault(require("node:path"));
const prettier_1 = __importDefault(require("prettier"));
const commander_1 = require("commander");
const buttonExample_js_1 = require("./cli/buttonExample.cjs");
const node_perf_hooks_1 = require("node:perf_hooks");
const node_child_process_1 = require("node:child_process");
const version = "1.0.0";
const program = new commander_1.Command();
program
    .name("djsify")
    .description("CLI to build djsify commands")
    .version("1.0.0");
program
    .command("--v")
    .description("Display djsify version")
    .action(() => {
    console.log(chalk_1.default.cyan(`djsify version: ${version}`));
});
program
    .command('update')
    .description('Update djsify')
    .action(async () => {
    console.log(chalk_1.default.blue(`Updating djsify...`));
    const install = await installPackage('djsify', 'latest', true);
    console.log(chalk_1.default.hex(`#90EE90`)('✔ ') + chalk_1.default.green(`djsify updated successfully to latest version in ${chalk_1.default.bold.yellow(install.toFixed(2))} ms`));
});
program
    .command("build")
    .description("to Start your bot")
    .action(() => {
    const directory = process.cwd();
    console.log(chalk_1.default.blue(`Starting build...`));
    let config;
    try {
        config = JSON.parse(fs_1.default.readFileSync(`${directory}/config.djs.json`, 'utf8'));
    }
    catch {
        return console.log(chalk_1.default.red('the workspace doesnt have a build file'));
    }
    const { type } = config;
    if (!type || type.toLowerCase() === 'js') {
        const child = (0, node_child_process_1.exec)("node .");
        child.stdout?.on('data', (data) => {
            process.stdout.write(chalk_1.default.gray(data.toString()));
            if (data.toString().toLowerCase().includes('logged in as')) {
                console.log(chalk_1.default.hex(`#90EE90`)('✔ ') + chalk_1.default.green("Bot started successfully."));
            }
        });
        child.stderr?.on('data', (data) => {
            process.stdout.write(chalk_1.default.red(data.toString()));
        });
        child.on('error', (error) => {
            console.error(chalk_1.default.red(`Error executing node: ${error.message}`));
        });
        child.on('close', (code) => {
            if (code === 0) {
                console.log(chalk_1.default.hex(`#90EE90`)('✔ ') + chalk_1.default.green("Bot started successfully."));
            }
            else {
                console.error(chalk_1.default.red(`Process exited with code ${code}`));
            }
        });
        return;
    }
    (0, node_child_process_1.exec)("npx tsc", (error, stdout, stderr) => {
        if (error) {
            console.error(chalk_1.default.red(`Error executing tsc: ${error.message}`));
            console.error(chalk_1.default.red(`stdout: ${stdout}`));
            console.error(chalk_1.default.red(`stderr: ${stderr}`));
            return;
        }
        console.log(chalk_1.default.hex(`#90EE90`)('✔ ') + chalk_1.default.green("TypeScript compilation completed."));
        if (stdout)
            console.log(chalk_1.default.gray(`stdout: ${stdout}`));
        const child = (0, node_child_process_1.exec)("cd dist && node .");
        child.stdout?.on('data', (data) => {
            process.stdout.write(chalk_1.default.gray(data.toString()));
            if (data.toString().toLowerCase().includes('logged in as')) {
                console.log(chalk_1.default.hex(`#90EE90`)('✔ ') + chalk_1.default.green("Bot started successfully."));
            }
        });
        child.stderr?.on('data', (data) => {
            process.stdout.write(chalk_1.default.red(data.toString()));
        });
        child.on('error', (error) => {
            process.stdout.write(chalk_1.default.red(`Error executing node: ${error.message}`));
        });
        child.on('close', (code) => {
            if (code === 0) {
                console.log(chalk_1.default.hex(`#90EE90`)('✔ ') + chalk_1.default.green("Bot started successfully."));
            }
            else {
                console.error(chalk_1.default.red(`Process exited with code ${code}`));
            }
        });
    });
});
program
    .command("createButton <buttonCustomId>")
    .description("Create a new button")
    .action((buttonCustomId) => {
    console.log(chalk_1.default.blue(`Creating button with custom ID: ${buttonCustomId}`));
    const currentDirectory = process.cwd();
    const content = (0, buttonExample_js_1.GetButtonExmaple)(buttonCustomId);
    try {
        fs_1.default.existsSync(currentDirectory + "/buttons") ||
            fs_1.default.mkdirSync(currentDirectory + "/buttons");
        fs_1.default.writeFileSync(node_path_1.default.join(currentDirectory, "buttons", `${buttonCustomId}.ts`), content);
        console.log(chalk_1.default.green(`Done creating button file with ${buttonCustomId} id`));
    }
    catch (error) {
        console.error(chalk_1.default.red("Error creating button file:"), error);
    }
});
program
    .command("createSlash")
    .description("Create a new slash command")
    .action(() => {
    inquirer_1.default.prompt(questionsSlash).then(async (answers) => {
        const commandName = answers.commandName?.replace(/[^a-zA-Z0-9]/g, '');
        const commandDescription = answers.commandDescription;
        const currentDirectory = process.cwd();
        const exists = fs_1.default.existsSync(node_path_1.default.join(currentDirectory, "config.djs.json"));
        if (!exists) {
            console.log(chalk_1.default.red("This directory does not have a djs config file."));
            return;
        }
        ;
        const file = JSON.parse(fs_1.default.readFileSync(currentDirectory + "/config.djs.json", "utf8"));
        const commandType = answers.commandType.toUpperCase();
        let type;
        if (commandType === "I DONT WANT") {
            type = "none";
        }
        else {
            type = commandType;
        }
        ;
        const isESM = file.module === 'module';
        const isTS = file.type === 'TS';
        const { type: language } = file;
        const importStatement = isESM
            ? `import { SlashCommandFile } from 'djsify';`
            : 'const { SlashCommandFile } = require("djsify");';
        const djsifyImport = isESM
            ? `import { OptionType, SlashCommand } from 'djsify';\nimport { SlashCommandBuilder } from 'discord.js';`
            : 'const { OptionType, SlashCommand } = require("djsify");\nconst { SlashCommandBuilder } = require("discord.js");';
        const commandStructure = `
        ${importStatement}
        ${djsifyImport}
        ${!isTS ? `/**
 * @type {SlashCommandFile}
 */` : ""}
        const ${commandName}${isTS ? ": SlashCommandFile" : ""} = {
          data: new SlashCommandBuilder()
            .setName('${commandName}')
            .setDescription('${commandDescription}')
            ${type !== "none"
            ? `.addStringOption(option =>
                option
                  .setName("your_option_name")
                  .setDescription("your option description")
                  .setRequired(true)
              )`
            : ""},

          async execute(interaction) {
            // Command execution logic here
          }
        };

        ${isESM ? 'export default' : 'module.exports ='} ${commandName};
      `;
        const location = currentDirectory + `/commands/${commandName}.${language.toLowerCase()}`;
        const prettified = await prettier_1.default.format(commandStructure, {
            ...prettierConfig,
            filepath: location
        });
        fs_1.default.writeFileSync(location, prettified);
        console.log(chalk_1.default.hex(`#90EE90`)('✔ ') + chalk_1.default.green(`Slash command created successfully: /${commandName}`));
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
        type: "list",
        name: 'Es Module / CommonJS',
        message: "Choose your module type",
        choices: ["module", "CommonJS"],
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
    .action(async () => {
    try {
        const answers = await inquirer_1.default.prompt(questions);
        const { 'js / ts': typeLanguage, 'Es Module / CommonJS': moduleType, buttonOn, slashCommandsOn, botToken, messageOn } = answers;
        const currentDirectory = process.cwd();
        const isTS = typeLanguage === "TS";
        const fileExt = `.${typeLanguage.toLowerCase()}`;
        const isESM = moduleType === "module";
        const baseCode = isESM ?
            `import { djsClient } from 'djsify';
    const { client } = new djsClient({
        token: '',
        buttonOn: true,
        slashCommandsOn: true,
        messageCommandsOn : true,
        ${isTS ? 'ButtonCommandDir' : 'ButtonCommandDir'} : '/buttons', // not required
        slashCommandDir : '/commands', // not required
        messageCommandDir : '/messages' // not required
    });` :
            `const { djsClient } = require('djsify');
const { client } = new djsClient({
    token: '',
    buttonOn: true,
    slashCommandsOn: true,
    messageCommandsOn : true,
    ${isTS ? 'ButtonCommandDir' : 'ButtonCommandDir'} : '/buttons', // not required
    slashCommandDir : '/commands', // not required
    messageCommandDir : '/messages' // not required
});`;
        const code = isTS ? `${baseCode}
// you can use client in any other interactions or messages
// for e.g
client.once('ready', () => {
  console.log('I Love djsify');
});
/* thats all you shouldnt do any thing else editing in the created folders
 ${slashCommandsOn ? "/slash_commands" : ""}
 ${buttonOn ? "/buttons" : ""}
 ${messageOn ? "/messages" : ""}
*/` : `${baseCode}
/* thats all you shouldnt do any thing else editing in the created folders
 ${slashCommandsOn ? "/slash_commands" : ""}
 ${buttonOn ? "/buttons" : ""}
 ${messageOn ? "/messages" : ""}
*/`;
        const dirs = {
            buttons: buttonOn,
            commands: slashCommandsOn,
            messages: messageOn
        };
        Object.entries(dirs).forEach(([dir, enabled]) => {
            if (enabled && !fs_1.default.existsSync(`${currentDirectory}/${dir}`)) {
                fs_1.default.mkdirSync(`${currentDirectory}/${dir}`);
            }
        });
        fs_1.default.writeFileSync(`${currentDirectory}/config.djs.json`, JSON.stringify(baseConfig(typeLanguage, botToken, isESM ? 'module' : 'commonjs'), null, 4));
        fs_1.default.writeFileSync(`${currentDirectory}/index${fileExt}`, code);
        const { MessageFileJS, MessageFileTS, buttonFile, buttonFileTS, commandFile, commandFileTS, tsConfig } = await createSampleFiles(isESM, isTS);
        const sampleFiles = {
            [`/buttons/djs${fileExt}`]: isTS ? buttonFileTS : buttonFile,
            [`/commands/ping${fileExt}`]: isTS ? commandFileTS : commandFile,
            [`/messages/helloWorld${fileExt}`]: isTS ? MessageFileTS : MessageFileJS
        };
        Object.entries(sampleFiles).forEach(([path, content]) => {
            const fullPath = currentDirectory + path;
            const dir = node_path_1.default.dirname(fullPath);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.writeFileSync(fullPath, content);
        });
        if (isTS) {
            fs_1.default.writeFileSync(`${currentDirectory}/tsconfig.json`, tsConfig);
        }
        if (isESM) {
            const packageJson = {
                "type": "module"
            };
            fs_1.default.writeFileSync(`${currentDirectory}/package.json`, JSON.stringify(packageJson, null, 2));
        }
        const filesToPrettify = [
            `${currentDirectory}/index${fileExt}`,
            ...Object.keys(sampleFiles).map(path => currentDirectory + path)
        ];
        for (const file of filesToPrettify) {
            if (fs_1.default.existsSync(file)) {
                const content = fs_1.default.readFileSync(file, 'utf8');
                const prettified = await prettier_1.default.format(content, {
                    ...prettierConfig,
                    filepath: file
                });
                fs_1.default.writeFileSync(file, prettified);
            }
        }
        console.log(chalk_1.default.bold.green('✓') + chalk_1.default.white.bold(' files Setup completed successfully'));
        const duration = await installPackage('djsify');
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(`${chalk_1.default.green('✔')} ${chalk_1.default.bold.green('Packages installed successfully')} ${chalk_1.default.gray('in')} ${chalk_1.default.bold.yellow(duration.toFixed(2))} ${chalk_1.default.gray('ms')}`);
        console.log(`\n${chalk_1.default.cyan.bold('🚀 Ready to launch!')} ${chalk_1.default.bold.gray('Start your application with:')} ${chalk_1.default.blue.bold('djs build')}`);
    }
    catch (error) {
        if (error.isTtyError) {
            console.log(chalk_1.default.red("Prompt couldn't be rendered in the current environment"));
        }
        else if (error.name === "ExitPromptError") {
            console.log(chalk_1.default.yellow("User exited the prompt"));
        }
        else {
            console.log(chalk_1.default.red("An error occurred:"), error);
        }
    }
    finally {
        process.exit(0);
    }
});
program.parse(process.argv);
program.on('exit', (code) => {
    if (code === 0) {
        console.log(chalk_1.default.green('✓ Setup completed successfully'));
        console.log(chalk_1.default.cyan('> You can run this application using'), chalk_1.default.yellow('djs build'));
    }
});
const handleExit = (signal) => {
    console.log(chalk_1.default.yellow(`\nReceived ${signal}. Gracefully shutting down...`));
    process.exit(0);
};
process.on("unhandledRejection", (err) => {
    console.log(chalk_1.default.red('⛔ User closed process gracefully'), err);
    process.exit(1);
});
process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("SIGINT", () => handleExit("SIGINT"));
async function createSampleFiles(isESM, isTS) {
    const description = "`The bot ${pingType || 'API'} ping is ${pingType === 'ws' ? interaction.client.ws.ping : apiPing}ms`";
    const commonCommandLogic = `
        const pingType = interaction.options.get('type')?.value;
        const start = Date.now();
        await interaction.deferReply();
        const end = Date.now();
        const apiPing = end - start;
        const embed = {
            title: 'Ping',
            description: ${description},
            color: Colors.Aqua
        };
        if (interaction.isRepliable()) {
            await interaction.editReply({ embeds: [embed] });
        }`;
    const commandBase = {
        data: `new SlashCommandBuilder()
              .setName('ping')
              .setDescription('Replies with "Pong!"')
              .addStringOption(option => 
                  option.setName('type')
                      .setDescription('type')
                      .setRequired(false)
                      .addChoices(
                          { name: 'ws', value: 'ws' },
                          { name: 'api', value: 'api' }
                      )
              )`,
        executeLogic: commonCommandLogic
    };
    const buttonBase = {
        data: { customId: 'djs-builder' },
        execute: 'async interaction => { await interaction.reply("Hello World!"); }'
    };
    const messageBase = {
        data: {
            content: 'hi',
            includes: true
        },
        executeLogic: `
        const args = message.content.split(" ");
        if (args[0] === 'hi' && args[1] === 'djs') {
            await message.reply('Hello world!');
        }`
    };
    const commandFile = `${isESM ? 'import { Colors, SlashCommandFile, OptionType, ButtonCommandFile, MessageCommandFile } from "djsify"\nimport { SlashCommandBuilder } from "discord.js"' : 'const { Colors, SlashCommandFile, OptionType, ButtonCommandFile, MessageCommandFile } = require("djsify")\nconst { SlashCommandBuilder } = require("discord.js")'}
    ${isESM ? '' : '\n'}
    ${!isTS ? `/**
 * @type {SlashCommandFile}
 */` : ''}
    const command${isTS ? ':SlashCommandFile' : ''} = {
          data: ${commandBase.data},
          async execute(interaction) {${commandBase.executeLogic}
          }
    };
    ${isESM ? 'export default command;' : 'module.exports = command;'}`;
    const buttonFile = `${isESM ? 'import { ButtonCommandFile } from "djsify";' : 'const { ButtonCommandFile } = require("djsify");'}
  ${isTS ? `/**
    * @type {ButtonCommandFile}
    */` : ''}
  const button${isTS ? ': ButtonCommandFile' : ''} = {
        data: ${JSON.stringify(buttonBase.data)},
        execute: ${buttonBase.execute}
  };
  ${isESM ? 'export default button;' : 'module.exports = button;'}`;
    const messageFile = `${isESM ? `import { MessageCommandFile } from "djsify";` : 'const { MessageCommandFile } = require("djsify")'}
  /**
 * @type {MessageCommandFile}
 */
  const message${isTS ? ':MessageCommandFile' : ''} = {
        data: ${JSON.stringify(messageBase.data)},
        async execute(message) {${messageBase.executeLogic}
        }
  };
    ${isESM ? 'export default message;' : 'module.exports = message;'}`;
    const tsConfig = {
        compilerOptions: {
            target: "ES2022",
            module: isESM ? "NodeNext" : "commonjs",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            outDir: "./dist",
            rootDir: "./",
            resolveJsonModule: true,
            moduleResolution: isESM ? "NodeNext" : "Node",
            noImplicitAny: true
        },
        include: [
            "./**/*"
        ],
        exclude: ["node_modules", "**/*.test.ts"]
    };
    return {
        MessageFileJS: messageFile,
        MessageFileTS: messageFile,
        commandFile,
        commandFileTS: commandFile,
        buttonFile,
        buttonFileTS: buttonFile,
        tsConfig: JSON.stringify(tsConfig, null, 2)
    };
}
const baseConfig = (typeLanguage, botToken, type) => ({
    type: typeLanguage,
    buttonOn: true,
    slashCommandsOn: true,
    module: type,
    botToken,
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
    codename: "djsify",
});
const prettierConfig = {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
    tabWidth: 2,
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    useTabs: false,
    quoteProps: 'as-needed',
    jsxSingleQuote: false,
    jsxBracketSameLine: false,
    parser: 'typescript'
};
async function installPackage(pkgName, version = 'latest', isGlobal = false) {
    const start = node_perf_hooks_1.performance.now();
    try {
        let i = 0;
        const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        const interval = setInterval(() => {
            process.stdout.write(chalk_1.default.cyan(`\r${spinner[i]} 📦 Installing packages`));
            i = (i + 1) % spinner.length;
        }, 80);
        await new Promise((resolve, reject) => {
            (0, node_child_process_1.exec)(`npm install ${pkgName}@${version} ${isGlobal ? '-g' : ''} --save`, { timeout: 60000 }, (error, _, stderr) => {
                clearInterval(interval);
                if (error) {
                    console.error(chalk_1.default.red(stderr));
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    catch (error) {
        console.error(chalk_1.default.red(`❌ Error installing ${pkgName}@${version}:`), error);
        throw error;
    }
    const end = node_perf_hooks_1.performance.now();
    return end - start;
}
