import fs from 'fs';
import path from 'path';
import SlashType from "src/type/SlashType";
import { MessageCommandFile } from "src/type/MessageCommandFile";
import { SlashCommandFile } from "src/type/SlashCommandFile";
import { ButtonCommandFile } from "src/type/ButtonCommandFile";
import { ActivityType, ChannelType, Client, Collection, Colors, GatewayIntentBits, Partials, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

function consoleError(err: unknown) {
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
    } else {
        console.log(RED + '%s' + RESET, `│ ${err}`.padEnd(BOX_WIDTH - 1) + '│');
    }

    console.log(RED + '%s' + RESET, BOX_BOTTOM);
}
export class djsClient {    
    public client: Client & { messageCommands?: Collection<string, MessageCommandFile>, slashCommands?: Collection<string, SlashCommandFile>, buttons?: Collection<string, ButtonCommandFile> };
    private buttonDirectoryName = 'buttons';
    private slashCommandDirectoryName = 'slash_commands';
    private messageCommandDirectoryName = 'messages';
    private token = '';
    public allowedGuilds: Set<string | null> = new Set([]);

    public addAllowedGuilds(guildId: string) {
        this.allowedGuilds.add(guildId);
        return this.allowedGuilds;
    };
    public getAllowedGuilds() {
        return [...this.allowedGuilds];
    };
    public async setSlashCommandDir(dirname: string) {
        this.slashCommandDirectoryName = dirname;
    };

    public async setButtonCommandsDir(dirname: string) {
        this.buttonDirectoryName = dirname;
    };

    public async setMessageCommandDir(dirname: string) {
        this.messageCommandDirectoryName = dirname;
    };
    public async setStatus(status: 'online' | 'idle' | 'dnd' | 'invisible') {
        this.client.user?.setStatus(status);
    }
    public async setActivity(name: string, type: ActivityType) {
        this.client.user?.setActivity(name, { type: type });
    };
    
    public async reload() {
        this.client.destroy();
        await this.client.login(this.token);
    };
    constructor({
        token,
        buttonOn,
        slashCommandsOn,
        messageCommandsOn,
        slashCommandDir,
        ButtonCommandDir,
        messageCommandDir,
        status,
        activityName,
        activityType,
        restTimeout,
        sharding,
        intents,
        partials,
        prefex,
        allowBots,
        allowDM,
        isPrivateBot,
    }: {
        token: string;
        buttonOn?: boolean;
        slashCommandsOn?: boolean;
        messageCommandsOn?: boolean;
        slashCommandDir?: string;
        ButtonCommandDir?: string;
        messageCommandDir?: string;
        status?: 'online' | 'idle' | 'dnd' | 'invisible';
        activityName?: string;
        activityType?: keyof typeof ActivityType;
        restTimeout?: number;
        sharding?: number | 'auto' | readonly number[];
        intents?: Exclude<keyof typeof GatewayIntentBits, GatewayIntentBits>[];
        partials?: (keyof typeof Partials)[];
        prefex?: string;
        allowBots?: boolean;
        allowDM?: boolean;
        isPrivateBot?: boolean;
    }) {
        const selectedIntents = intents
            ? intents.map(intent => GatewayIntentBits[intent])
            : Object.values(GatewayIntentBits).filter((x): x is GatewayIntentBits => typeof x === 'number');

        const selectedPartials = partials
            ? partials.map(partial => Partials[partial])
            : Object.keys(Partials).map(key => Partials[key as keyof typeof Partials]);

        const fixedActivityType = ActivityType[activityType || 'Watching'];

        this.client = new Client({
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
            throw new Error(`Invalid token was provided. Error occurred at:\n${new Error().stack?.split("\n")[2]?.trim() || "Unknown location"
                }\n
  The error happened because the provided token was not a string or it's not well formatted as a Discord bot token!\n`);
        }

        this.client.buttons = new Collection<string, ButtonCommandFile>();
        this.client.slashCommands = new Collection<string, SlashCommandFile>();
        this.client.messageCommands = new Collection<string, MessageCommandFile>();

        const commands: Set<SlashType> = new Set([]);
        const currentDirectory = process.cwd();

        const readDirectory = (dir: string) => fs.existsSync(`${currentDirectory}/${dir}`) ? fs.readdirSync(`${currentDirectory}/${dir}`).filter(f => f.endsWith('.js') || f.endsWith('.ts')) : [];

        const buttonDirectory = readDirectory(ButtonCommandDir || this.buttonDirectoryName);
        const slashCommandDirectory = readDirectory(slashCommandDir || this.slashCommandDirectoryName);
        const messageCommandDirectory = readDirectory(messageCommandDir || this.messageCommandDirectoryName);

        const loadCommands = async (directory: string[], type: string, collection: Collection<string, SlashCommandFile | ButtonCommandFile | MessageCommandFile>, onLoad?: (command: SlashCommandFile | ButtonCommandFile | MessageCommandFile) => void) => {
            const addedCommands: string[] = [];
            for (const file of directory) {
                try {
                    const filePath = path.join(currentDirectory, type, file);
                    type moduleType = SlashCommandFile | ButtonCommandFile | MessageCommandFile;
                    let command: moduleType | { default: moduleType } = require(filePath);
                    const commandModule: moduleType = 'default' in command ? command.default : command;
                    const data = commandModule.data;
                    let result: string | string[] | undefined;

                    if ('customId' in data) {
                        result = data.customId;
                    } else if ('content' in data) {
                        result = data.content;
                    } else if ('name' in data) {
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
                } catch (error) {
                    console.error(`Failed to load command ${file}:`, error);
                }
            }

            console.log(`\x1b[32m[${type.charAt(0).toUpperCase() + type.slice(1)} Commands]\x1b[0m Loaded: \x1b[36m${addedCommands.join(', ')}\x1b[0m`);
            return addedCommands;
        };

        if (slashCommandsOn) {
            loadCommands(slashCommandDirectory, slashCommandDir || this.slashCommandDirectoryName, this.client.slashCommands, (command: SlashCommandFile | ButtonCommandFile | MessageCommandFile) => {
                if ('name' in command.data) {
                    commands.add(command.data as RESTPostAPIApplicationCommandsJSONBody);
                }
            });

            this.client.on('interactionCreate', async (i) => {
                if (!i.isCommand()) return;

                const command = this.client?.slashCommands?.get(i.commandName);
                if (!command) return;

                if (isPrivateBot && (!i.guild || !this.allowedGuilds.has(i?.guildId))) {
                    return i.isRepliable() && i.reply({
                        embeds: [{
                            title: `** This Server is not allowed to use this bot! **`,
                            color: Colors.Red
                        }]
                    });
                }

                try {
                    await command.execute(i);
                } catch (err) {
                    consoleError(err);
                    const errorMessage = {
                        content: `An error occurred while executing the command:`,
                        flags: 64,
                    };

                    if (i.isRepliable() && !i.replied) await i.reply(errorMessage);
                    else if (i.replied || i.deferred) await i.editReply(errorMessage);
                    else if ('followUp' in i && !i.deferred) await i.followUp(errorMessage);
                }
                return;
            });
        } else {
            this.client.on('interactionCreate', (i) => {
                if (!i.isCommand()) return;

                const errorMessage = {
                    content: `Slash Commands Are not Activated in this Bot`,
                    flags: 64,
                };

                if (i.isRepliable() && !i.replied) i.reply(errorMessage);
                else if ('followUp' in i && !i.deferred) i.followUp(errorMessage);
            });
        }

        if (buttonOn) {
            const buttonCommands = new Map<string, ButtonCommandFile>();
            loadCommands(buttonDirectory, ButtonCommandDir || this.buttonDirectoryName, this.client.buttons, (command: ButtonCommandFile | SlashCommandFile | MessageCommandFile) => {
                if (!('customId' in command.data)) throw new Error(`Button Commands must have a customId in command ${command.data}`);

                const customIds = Array.isArray(command.data.customId) ? command.data.customId : [command.data.customId];
                customIds.forEach(customId => buttonCommands.set(customId, command as ButtonCommandFile));
            });

            this.client.on('interactionCreate', async (i) => {
                if (!i.isButton()) return;

                if (isPrivateBot && (!i.guild || !this.allowedGuilds.has(i.guildId))) {
                    return i.isRepliable() && i.reply({
                        embeds: [{
                            title: `** This Server is not allowed to use this bot! **`,
                            color: Colors.Red
                        }]
                    });
                }

                const findCommand = (id: string) => {
                    const exactMatch = buttonCommands.get(id);
                    if (exactMatch) return exactMatch;

                    return Array.from(buttonCommands.entries()).find(([key]) =>
                        id.startsWith(key) || id.endsWith(key) || id.includes(key)
                    )?.[1];
                };

                const command = findCommand(i.customId);
                if (!command) return;

                try {
                    const shouldExecute = Array.isArray(command.data.customId)
                        ? command.data.customId.some(id =>
                            (command.data.startsWith && i.customId.startsWith(id)) ||
                            (command.data.includes && i.customId.includes(id)) ||
                            (command.data.endsWith && i.customId.endsWith(id)) ||
                            i.customId === id
                        )
                        : (command.data.startsWith && i.customId.startsWith(command.data.customId)) ||
                        (command.data.includes && i.customId.includes(command.data.customId)) ||
                        (command.data.endsWith && i.customId.endsWith(command.data.customId)) ||
                        i.customId === command.data.customId;

                    if (shouldExecute) await command.execute(i);
                } catch (err) {
                    consoleError(err);
                    const errorMessage = {
                        content: `An error occurred while executing the command:`,
                        flags: 64,
                    };

                    if (!i.replied && i.isRepliable()) await i.reply(errorMessage);
                    else if (!i.replied && 'followUp' in i) await i.followUp(errorMessage);
                };

                return;
            });
        } else {
            this.client.on('interactionCreate', (i) => {
                if (!i.isButton()) return;

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
            const Warned: Set<string> = new Set([]);

            this.client.on('messageCreate', async (m) => {
                if ((m.author.bot && m.author.id === this?.client?.user?.id) || (!allowBots && m.author.bot)) return;
                
                if (!allowDM && m.channel.type === ChannelType.DM ) return;

                if (prefex && !m.content.startsWith(prefex)) return;

                const args = m.content.trim().split(/\s+/);
                const commandName = args[0].toLowerCase().replace(prefex || '' as string, '');
                const command = this.client.messageCommands?.get(commandName);

                if (!command) return;

                try {
                    const contents = Array.isArray(command.data.content) ? command.data.content : [command.data.content];
                    const shouldExecute = command.data.startsWith && contents.some(content => m.content.startsWith(content)) ||
                        command.data.includes && contents.some(content => m.content.includes(content)) ||
                        command.data.endsWith && contents.some(content => m.content.endsWith(content)) ||
                        contents.includes(m.content);

                    if (shouldExecute && Warned.has(m.author.id)) return;
                    if (isPrivateBot && (!m?.guild || !this.allowedGuilds?.has(m?.guildId))) {
                        Warned.add(m.author.id);
                        return m.reply({
                            embeds: [{
                                title: `** This Server is not allowed to use this bot! **`,
                                color: Colors.Red
                            }]
                        });
                    };

                    if (shouldExecute) await command.execute(m);
                } catch (err) {
                    consoleError(err);
                    await m.reply({
                        content: `An error occurred while executing the command:`,
                    });
                };

                return;
            });
        }

        this.client.once("ready", async () => {
            try {

                await this.client.application?.commands.set([...commands]);

            } catch (error) {
                console.error('Failed to set commands:', error);
            }
        });

        try {
            this.client.login(token).then(() => {
                this.token = token;
            });
        } catch (err) {
            throw new Error(`Invalid token was been provided at Error occurred at: ${new Error().stack?.split("\n")[2]?.trim() || "Unknown location"
                }\n
              the error happened because the provided token is not valid !\n${new Error().stack?.split("\n")[2]
                }`);
        }

        this.client.once("ready", () => {
            console.log(
                `\x1b[36m%s\x1b[0m`,
                `┌───────────────────────────────────────┐`
            );
            console.log(
                `\x1b[36m│\x1b[0m     \x1b[32mLogged in as\x1b[0m \x1b[1m%s\x1b[0m     \x1b[36m│\x1b[0m`,
                this?.client?.user?.tag || "unknown application"
            );
            console.log(
                `\x1b[36m%s\x1b[0m`,
                `└───────────────────────────────────────┘`
            );
        });
    }
}

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