"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.djsClient = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_js_1 = require("discord.js");
function consoleError(err) {
    const BOX_WIDTH = 53;
    const RED = '\x1b[31m';
    const RESET = '\x1b[0m';
    const BOX_TOP = '┌' + '─'.repeat(BOX_WIDTH - 2) + '┐';
    const BOX_MIDDLE = '├' + '─'.repeat(BOX_WIDTH - 2) + '┤';
    const BOX_BOTTOM = '└' + '─'.repeat(BOX_WIDTH - 2) + '┘';
    const TITLE = '│' + ' '.repeat(19) + 'ERROR OCCURRED' + ' '.repeat(19) + '│';
    const ERROR_LABEL = '│ Error details:' + ' '.repeat(35) + '│';
    console.log(RED + '%s' + RESET, BOX_TOP);
    console.log(RED + '%s' + RESET, TITLE);
    console.log(RED + '%s' + RESET, BOX_MIDDLE);
    console.log(RED + '%s' + RESET, ERROR_LABEL);
    if (err instanceof Error) {
        console.log(RED + '%s' + RESET, `│ Name: ${err.name}`.padEnd(BOX_WIDTH - 1) + '│');
        console.log(RED + '%s' + RESET, `│ Message: ${err.message}`.padEnd(BOX_WIDTH - 1) + '│');
        if (err.stack) {
            const stackLines = err.stack.split('\n');
            for (const line of stackLines) {
                console.log(RED + '%s' + RESET, `│ ${line}`.padEnd(BOX_WIDTH - 1) + '│');
            }
        }
    }
    else {
        console.log(RED + '%s' + RESET, `│ ${err}`.padEnd(BOX_WIDTH - 1) + '│');
    }
    console.log(RED + '%s' + RESET, BOX_BOTTOM);
}
class djsClient {
    client;
    buttonDirectoryName = 'buttons';
    slashCommandDirectoryName = 'slash_commands';
    messageCommandDirectoryName = 'messages';
    token = '';
    allowedGuilds = new Set([]);
    addAllowedGuilds(guildId) {
        this.allowedGuilds.add(guildId);
        return this.allowedGuilds;
    }
    ;
    getAllowedGuilds() {
        return [...this.allowedGuilds];
    }
    ;
    async setSlashCommandDir(dirname) {
        this.slashCommandDirectoryName = dirname;
    }
    ;
    async setButtonCommandsDir(dirname) {
        this.buttonDirectoryName = dirname;
    }
    ;
    async setMessageCommandDir(dirname) {
        this.messageCommandDirectoryName = dirname;
    }
    ;
    async setStatus(status) {
        this.client.user?.setStatus(status);
    }
    async setActivity(name, type) {
        this.client.user?.setActivity(name, { type: type });
    }
    ;
    async reload() {
        this.client.destroy();
        await this.client.login(this.token);
    }
    ;
    constructor({ token, buttonOn, slashCommandsOn, messageCommandsOn, slashCommandDir, ButtonCommandDir, messageCommandDir, status, activityName, activityType, restTimeout, sharding, intents, partials, prefex, allowBots, allowDM, isPrivateBot, }) {
        const selectedIntents = intents
            ? intents.map(intent => discord_js_1.GatewayIntentBits[intent])
            : Object.values(discord_js_1.GatewayIntentBits).filter((x) => typeof x === 'number');
        const selectedPartials = partials
            ? partials.map(partial => discord_js_1.Partials[partial])
            : Object.keys(discord_js_1.Partials).map(key => discord_js_1.Partials[key]);
        const fixedActivityType = discord_js_1.ActivityType[activityType || 'Watching'];
        this.client = new discord_js_1.Client({
            intents: selectedIntents,
            ...(activityName && {
                presence: {
                    activities: [{ name: activityName || 'djsify', type: fixedActivityType || 0 }],
                    status: status || 'online'
                }
            }),
            partials: selectedPartials,
            failIfNotExists: false,
            shards: sharding || 'auto',
            rest: { timeout: restTimeout || 25000 }
        });
        if (typeof token !== "string" || token.length < 59) {
            throw new Error(`Invalid token was provided. Error occurred at:\n${new Error().stack?.split("\n")[2]?.trim() || "Unknown location"}\n
  The error happened because the provided token was not a string or it's not well formatted as a Discord bot token!\n`);
        }
        this.client.buttons = new discord_js_1.Collection();
        this.client.slashCommands = new discord_js_1.Collection();
        this.client.messageCommands = new discord_js_1.Collection();
        const commands = new Set([]);
        const currentDirectory = process.cwd();
        const readDirectory = (dir) => fs_1.default.existsSync(`${currentDirectory}/${dir}`) ? fs_1.default.readdirSync(`${currentDirectory}/${dir}`).filter(f => f.endsWith('.cjs') || f.endsWith('.ts')) : [];
        const buttonDirectory = readDirectory(ButtonCommandDir || this.buttonDirectoryName);
        const slashCommandDirectory = readDirectory(slashCommandDir || this.slashCommandDirectoryName);
        const messageCommandDirectory = readDirectory(messageCommandDir || this.messageCommandDirectoryName);
        const loadCommands = async (directory, type, collection, onLoad) => {
            const addedCommands = [];
            for (const file of directory) {
                try {
                    const filePath = path_1.default.join(currentDirectory, type, file);
                    let command = require(filePath);
                    const commandModule = 'default' in command ? command.default : command;
                    const data = commandModule.data;
                    let result;
                    if ('customId' in data) {
                        result = data.customId;
                    }
                    else if ('content' in data) {
                        result = data.content;
                    }
                    else if ('name' in data) {
                        result = data.name;
                    }
                    const keys = Array.isArray(result) ? result : [result];
                    keys.forEach((key) => {
                        if (key) {
                            addedCommands.push(key);
                            if ('content' in commandModule.data && typeof commandModule.data.content === 'string') {
                                commandModule.data.content = prefex + commandModule.data.content;
                            }
                            collection.set(key, commandModule);
                            if (onLoad)
                                onLoad(commandModule);
                        }
                    });
                }
                catch (error) {
                    console.error(`Failed to load command ${file}:`, error);
                }
            }
            console.log(`\x1b[32m[${type.charAt(0).toUpperCase() + type.slice(1)} Commands]\x1b[0m Loaded: \x1b[36m${addedCommands.join(', ')}\x1b[0m`);
            return addedCommands;
        };
        if (slashCommandsOn) {
            loadCommands(slashCommandDirectory, slashCommandDir || this.slashCommandDirectoryName, this.client.slashCommands, (command) => {
                if ('name' in command.data) {
                    commands.add(command.data);
                }
            });
            this.client.on('interactionCreate', async (i) => {
                if (!i.isCommand())
                    return;
                const command = this.client?.slashCommands?.get(i.commandName);
                if (!command)
                    return;
                if (isPrivateBot && (!i.guild || !this.allowedGuilds.has(i?.guildId))) {
                    return i.isRepliable() && i.reply({
                        embeds: [{
                                title: `** This Server is not allowed to use this bot! **`,
                                color: discord_js_1.Colors.Red
                            }]
                    });
                }
                try {
                    await command.execute(i);
                }
                catch (err) {
                    consoleError(err);
                    const errorMessage = {
                        content: `An error occurred while executing the command:`,
                        flags: 64,
                    };
                    if (i.isRepliable() && !i.replied)
                        await i.reply(errorMessage);
                    else if (i.replied || i.deferred)
                        await i.editReply(errorMessage);
                    else if ('followUp' in i && !i.deferred)
                        await i.followUp(errorMessage);
                }
                return;
            });
        }
        else {
            this.client.on('interactionCreate', (i) => {
                if (!i.isCommand())
                    return;
                const errorMessage = {
                    content: `Slash Commands Are not Activated in this Bot`,
                    flags: 64,
                };
                if (i.isRepliable() && !i.replied)
                    i.reply(errorMessage);
                else if ('followUp' in i && !i.deferred)
                    i.followUp(errorMessage);
            });
        }
        if (buttonOn) {
            const buttonCommands = new Map();
            loadCommands(buttonDirectory, ButtonCommandDir || this.buttonDirectoryName, this.client.buttons, (command) => {
                if (!('customId' in command.data))
                    throw new Error(`Button Commands must have a customId in command ${command.data}`);
                const customIds = Array.isArray(command.data.customId) ? command.data.customId : [command.data.customId];
                customIds.forEach(customId => buttonCommands.set(customId, command));
            });
            this.client.on('interactionCreate', async (i) => {
                if (!i.isButton())
                    return;
                if (isPrivateBot && (!i.guild || !this.allowedGuilds.has(i.guildId))) {
                    return i.isRepliable() && i.reply({
                        embeds: [{
                                title: `** This Server is not allowed to use this bot! **`,
                                color: discord_js_1.Colors.Red
                            }]
                    });
                }
                const findCommand = (id) => {
                    const exactMatch = buttonCommands.get(id);
                    if (exactMatch)
                        return exactMatch;
                    return Array.from(buttonCommands.entries()).find(([key]) => id.startsWith(key) || id.endsWith(key) || id.includes(key))?.[1];
                };
                const command = findCommand(i.customId);
                if (!command)
                    return;
                try {
                    const shouldExecute = Array.isArray(command.data.customId)
                        ? command.data.customId.some(id => (command.data.startsWith && i.customId.startsWith(id)) ||
                            (command.data.includes && i.customId.includes(id)) ||
                            (command.data.endsWith && i.customId.endsWith(id)) ||
                            i.customId === id)
                        : (command.data.startsWith && i.customId.startsWith(command.data.customId)) ||
                            (command.data.includes && i.customId.includes(command.data.customId)) ||
                            (command.data.endsWith && i.customId.endsWith(command.data.customId)) ||
                            i.customId === command.data.customId;
                    if (shouldExecute)
                        await command.execute(i);
                }
                catch (err) {
                    consoleError(err);
                    const errorMessage = {
                        content: `An error occurred while executing the command:`,
                        flags: 64,
                    };
                    if (!i.replied && i.isRepliable())
                        await i.reply(errorMessage);
                    else if (!i.replied && 'followUp' in i)
                        await i.followUp(errorMessage);
                }
                ;
                return;
            });
        }
        else {
            this.client.on('interactionCreate', (i) => {
                if (!i.isButton())
                    return;
                return i.reply({
                    embeds: [{
                            title: 'Sorry, buttons are not activated in this bot',
                            color: 0xed4245
                        }],
                    flags: 64
                });
            });
        }
        if (messageCommandsOn) {
            loadCommands(messageCommandDirectory, messageCommandDir || this.messageCommandDirectoryName, this.client.messageCommands);
            const Warned = new Set([]);
            this.client.on('messageCreate', async (m) => {
                if ((m.author.bot && m.author.id === this?.client?.user?.id) || (!allowBots && m.author.bot))
                    return;
                if (!allowDM && m.channel.type === discord_js_1.ChannelType.DM)
                    return;
                if (prefex && !m.content.startsWith(prefex))
                    return;
                const args = m.content.trim().split(/\s+/);
                const commandName = args[0].toLowerCase().replace(prefex || '', '');
                const command = this.client.messageCommands?.get(commandName);
                if (!command)
                    return;
                try {
                    const contents = Array.isArray(command.data.content) ? command.data.content : [command.data.content];
                    const shouldExecute = command.data.startsWith && contents.some(content => m.content.startsWith(content)) ||
                        command.data.includes && contents.some(content => m.content.includes(content)) ||
                        command.data.endsWith && contents.some(content => m.content.endsWith(content)) ||
                        contents.includes(m.content);
                    if (shouldExecute && Warned.has(m.author.id))
                        return;
                    if (isPrivateBot && (!m?.guild || !this.allowedGuilds?.has(m?.guildId))) {
                        Warned.add(m.author.id);
                        return m.reply({
                            embeds: [{
                                    title: `** This Server is not allowed to use this bot! **`,
                                    color: discord_js_1.Colors.Red
                                }]
                        });
                    }
                    ;
                    if (shouldExecute)
                        await command.execute(m);
                }
                catch (err) {
                    consoleError(err);
                    await m.reply({
                        content: `An error occurred while executing the command:`,
                    });
                }
                ;
                return;
            });
        }
        this.client.once("ready", async () => {
            try {
                await this.client.application?.commands.set([...commands]);
            }
            catch (error) {
                console.error('Failed to set commands:', error);
            }
        });
        try {
            this.client.login(token).then(() => {
                this.token = token;
            });
        }
        catch (err) {
            throw new Error(`Invalid token was been provided at Error occurred at: ${new Error().stack?.split("\n")[2]?.trim() || "Unknown location"}\n
              the error happened because the provided token is not valid !\n${new Error().stack?.split("\n")[2]}`);
        }
        this.client.once("ready", () => {
            console.log(`\x1b[36m%s\x1b[0m`, `┌───────────────────────────────────────┐`);
            console.log(`\x1b[36m│\x1b[0m     \x1b[32mLogged in as\x1b[0m \x1b[1m%s\x1b[0m     \x1b[36m│\x1b[0m`, this?.client?.user?.tag || "unknown application");
            console.log(`\x1b[36m%s\x1b[0m`, `└───────────────────────────────────────┘`);
        });
    }
}
exports.djsClient = djsClient;
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('SIGINT', () => {
    console.log('Received SIGINT. Gracefully shutting down.');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Gracefully shutting down.');
    process.exit(0);
});
process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});
