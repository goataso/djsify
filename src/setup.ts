// src/setup.ts
import inquirer from "inquirer";
import fs from "fs";
import chalk from 'chalk';
import nodePath from 'node:path';
import prettier from 'prettier';
import { Command } from "commander";
import { GetButtonExmaple } from "./cli/buttonExample.js";
import { performance } from "node:perf_hooks";
import { exec } from "node:child_process";

const version = "1.0.0";
const program = new Command();

program
  .name("djsify")
  .description("CLI to build djsify commands")
  .version("1.0.0");
program
  .command("--v")
  .description("Display djsify version")
  .action(() => {
    console.log(chalk.cyan(`djsify version: ${version}`));
  });
program
  .command('update')
  .description('Update djsify')
  .action(async () => {
    console.log(chalk.blue(`Updating djsify...`));
    const install = await installPackage('djsify', 'latest', true);

    console.log(chalk.hex(`#90EE90`)('✔ ') + chalk.green(`djsify updated successfully to latest version in ${chalk.bold.yellow(install.toFixed(2))} ms`));
  });
program
  .command("build")
  .description("to Start your bot")
  .action(() => {
    const directory = process.cwd();
    console.log(chalk.blue(`Starting build...`));
    let config;
    try {
      config = JSON.parse(fs.readFileSync(`${directory}/config.djs.json`, 'utf8'));
    } catch {
      return console.log(chalk.red('the workspace doesnt have a build file'))
    }
    const { type } = config;
    if (!type || type.toLowerCase() === 'js') {
      const child = exec("node .");
      
      child.stdout?.on('data', (data) => {
        process.stdout.write(chalk.gray(data.toString()));
        if (data.toString().toLowerCase().includes('logged in as')){
          console.log(chalk.hex(`#90EE90`)('✔ ') + chalk.green("Bot started successfully."));
        }
      });

      child.stderr?.on('data', (data) => {
        process.stdout.write(chalk.red(data.toString()));
      });

      child.on('error', (error) => {
        console.error(chalk.red(`Error executing node: ${error.message}`));
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.hex(`#90EE90`)('✔ ') + chalk.green("Bot started successfully."));
        } else {
          console.error(chalk.red(`Process exited with code ${code}`));
        }
      });      return;
    }
    exec("npx tsc", (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(chalk.red(`Error executing tsc: ${error.message}`));
        console.error(chalk.red(`stdout: ${stdout}`));
        console.error(chalk.red(`stderr: ${stderr}`));
        return;
      }
      console.log(chalk.hex(`#90EE90`)('✔ ') + chalk.green("TypeScript compilation completed."));
      if (stdout) console.log(chalk.gray(`stdout: ${stdout}`));
      
      const child = exec("cd dist && node .");
      
      child.stdout?.on('data', (data) => {
        process.stdout.write(chalk.gray(data.toString()));
        if (data.toString().toLowerCase().includes('logged in as')){
          console.log(chalk.hex(`#90EE90`)('✔ ') + chalk.green("Bot started successfully."));
        }
      });

      child.stderr?.on('data', (data) => {
        process.stdout.write(chalk.red(data.toString()));
      });

      child.on('error', (error) => {
        process.stdout.write(chalk.red(`Error executing node: ${error.message}`));
      });

      child.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.hex(`#90EE90`)('✔ ') + chalk.green("Bot started successfully."));
        } else {
          console.error(chalk.red(`Process exited with code ${code}`));
        }
      });
    });
  });program
  .command("createButton <buttonCustomId>")
  .description("Create a new button")
  .action((buttonCustomId) => {
    console.log(chalk.blue(`Creating button with custom ID: ${buttonCustomId}`));
    const currentDirectory = process.cwd();
    const content = GetButtonExmaple(buttonCustomId);

    try {
      fs.existsSync(currentDirectory + "/buttons") ||
        fs.mkdirSync(currentDirectory + "/buttons");
      fs.writeFileSync(
        nodePath.join(currentDirectory, "buttons", `${buttonCustomId}.ts`),
        content
      );
      console.log(chalk.green(`Done creating button file with ${buttonCustomId} id`));
    } catch (error) {
      console.error(chalk.red("Error creating button file:"), error);
    }
  });

program
  .command("createSlash")
  .description("Create a new slash command")
  .action(() => {
    inquirer.prompt(questionsSlash as any).then(async (answers: any) => {
      const commandName = answers.commandName?.replace(/[^a-zA-Z0-9]/g, '');
      const commandDescription = answers.commandDescription;
      const currentDirectory = process.cwd();
      const exists = fs.existsSync(nodePath.join(currentDirectory, "config.djs.json"));
      if (!exists) {
        console.log(chalk.red("This directory does not have a djs config file."));
        return;
      };
      const file = JSON.parse(
        fs.readFileSync(currentDirectory + "/config.djs.json", "utf8")
      );
      const commandType = answers.commandType.toUpperCase();
      let type: string;
      if (commandType === "I DONT WANT") {
        type = "none";
      } else {
        type = commandType;
      };
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
 */`: ""}
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
          : ""
        },

          async execute(interaction) {
            // Command execution logic here
          }
        };

        ${isESM ? 'export default' : 'module.exports ='} ${commandName};
      `;

      const location = currentDirectory + `/commands/${commandName}.${language.toLowerCase()}`;      const prettified = await prettier.format(commandStructure, {
        ...prettierConfig,
        filepath: location
      });

      fs.writeFileSync(location, prettified);
      console.log(chalk.hex(`#90EE90`)('✔ ') + chalk.green(`Slash command created successfully: /${commandName}`));
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
] as const;
program
  .command("setup")
  .description("setup your bot environment")
  .action(async () => {
    try {
      const answers = await inquirer.prompt(questions as any);
      const {
        'js / ts': typeLanguage,
        'Es Module / CommonJS': moduleType,
        buttonOn,
        slashCommandsOn,
        botToken,
        messageOn
      } = answers;

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
});`
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
        if (enabled && !fs.existsSync(`${currentDirectory}/${dir}`)) {
          fs.mkdirSync(`${currentDirectory}/${dir}`);
        }
      });

      fs.writeFileSync(`${currentDirectory}/config.djs.json`, JSON.stringify(baseConfig(typeLanguage, botToken, isESM ? 'module' : 'commonjs'), null, 4));
      fs.writeFileSync(`${currentDirectory}/index${fileExt}`, code);

      const { MessageFileJS, MessageFileTS, buttonFile, buttonFileTS, commandFile, commandFileTS, tsConfig } = await createSampleFiles(isESM, isTS);
      const sampleFiles = {
        [`/buttons/djs${fileExt}`]: isTS ? buttonFileTS : buttonFile,
        [`/commands/ping${fileExt}`]: isTS ? commandFileTS : commandFile,
        [`/messages/helloWorld${fileExt}`]: isTS ? MessageFileTS : MessageFileJS
      };

      Object.entries(sampleFiles).forEach(([path, content]) => {
        const fullPath = currentDirectory + path;
        const dir = nodePath.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, content);
      });

      if (isTS) {
        fs.writeFileSync(`${currentDirectory}/tsconfig.json`, tsConfig);
      }

      if (isESM) {
        const packageJson = {
          "type": "module"
        };
        fs.writeFileSync(`${currentDirectory}/package.json`, JSON.stringify(packageJson, null, 2));
      }

      const filesToPrettify = [
        `${currentDirectory}/index${fileExt}`,
        ...Object.keys(sampleFiles).map(path => currentDirectory + path)
      ];

      for (const file of filesToPrettify) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          const prettified = await prettier.format(content, {
            ...prettierConfig,
            filepath: file
          });
          fs.writeFileSync(file, prettified);
        }
      }

      console.log(chalk.bold.green('✓') + chalk.white.bold(' files Setup completed successfully'));

      const duration = await installPackage('djsify');
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);

      process.stdout.write(
        `${chalk.green('✔')} ${chalk.bold.green('Packages installed successfully')} ${chalk.gray('in')} ${chalk.bold.yellow(duration.toFixed(2))} ${chalk.gray('ms')}`
      );

      console.log(
        `\n${chalk.cyan.bold('🚀 Ready to launch!')} ${chalk.bold.gray('Start your application with:')} ${chalk.blue.bold('djs build')}`
      );

    } catch (error: any) {
      if (error.isTtyError) {
        console.log(chalk.red("Prompt couldn't be rendered in the current environment"));
      } else if (error.name === "ExitPromptError") {
        console.log(chalk.yellow("User exited the prompt"));
      } else {
        console.log(chalk.red("An error occurred:"), error);
      }
    } finally {
      process.exit(0);
    }
  });

program.parse(process.argv);
program.on('exit', (code) => {
  if (code === 0) {
    console.log(chalk.green('✓ Setup completed successfully'));
    console.log(chalk.cyan('> You can run this application using'), chalk.yellow('djs build'));
  }
});

const handleExit = (signal: string) => {
  console.log(chalk.yellow(`\nReceived ${signal}. Gracefully shutting down...`));
  process.exit(0);
};

process.on("unhandledRejection", (err) => {
  console.log(chalk.red('⛔ User closed process gracefully'), err);
  process.exit(1);
});

process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("SIGINT", () => handleExit("SIGINT"));


async function createSampleFiles(isESM: boolean, isTS: boolean) {
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
 */`: ''}
    const command${isTS ? ':SlashCommandFile' : ''} = {
          data: ${commandBase.data},
          async execute(interaction) {${commandBase.executeLogic}
          }
    };
    ${isESM ? 'export default command;' : 'module.exports = command;'}`;

  const buttonFile = `${isESM ? 'import { ButtonCommandFile } from "djsify";' : 'const { ButtonCommandFile } = require("djsify");'}
  ${isTS ? `/**
    * @type {ButtonCommandFile}
    */`: ''}
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
    ${isESM ? 'export default message;' : 'module.exports = message;'}`; const tsConfig = {
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

const baseConfig = (typeLanguage: string, botToken: boolean, type: 'module' | 'commonjs') => ({
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
  trailingComma: 'all' as const,
  printWidth: 100,
  tabWidth: 2,
  bracketSpacing: true,
  arrowParens: 'always' as const,
  endOfLine: 'lf' as const,
  useTabs: false,
  quoteProps: 'as-needed' as const,
  jsxSingleQuote: false,
  jsxBracketSameLine: false,
  parser: 'typescript'
};
async function installPackage(pkgName: string, version = 'latest', isGlobal = false) {
  const start = performance.now();
  try {
    let i = 0;
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const interval = setInterval(() => {
      process.stdout.write(chalk.cyan(`\r${spinner[i]} 📦 Installing packages`));
      i = (i + 1) % spinner.length;
    }, 80);

    await new Promise<void>((resolve, reject) => {
      exec(`npm install ${pkgName}@${version} ${isGlobal ? '-g' : ''} --save`, { timeout: 60000 }, (error, _, stderr) => {
        clearInterval(interval);
        if (error) {
          console.error(chalk.red(stderr));
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error(chalk.red(`❌ Error installing ${pkgName}@${version}:`), error);
    throw error;
  }
  const end = performance.now();
  return end - start;
}