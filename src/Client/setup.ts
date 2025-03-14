import fs from 'node:fs';
import path from 'node:path';
import SlashType from "../type/SlashType.js";
import { MessageCommandFile } from "../type/MessageCommandFile.js";
import { SlashCommandFile } from "../type/SlashCommandFile.js";
import { ButtonCommandFile } from "../type/ButtonCommandFile.js";
import { ActivityType, ChannelType, Client, Collection, Colors, GatewayIntentBits, Interaction, Message, OmitPartialGroupDMChannel, Partials } from "discord.js";
import { ButtoncommandInteraction, MessageInteraction, SlashCommandInteraction } from '../type/Commands.js';

function consoleError(err: Error | object | string) {
    const MIN_BOX_WIDTH = 53;
    const RED = '\x1b[31m';
    const RESET = '\x1b[0m';

    let maxLineLength = MIN_BOX_WIDTH;

    if (err instanceof Error) {
        maxLineLength = Math.max(
            maxLineLength,
            `Name: ${err.name}`.length + 4,
            `Message: ${err.message}`.length + 4
        );
        if (err.stack) {
            const stackLines = err.stack.split('\n');
            for (const line of stackLines) {
                maxLineLength = Math.max(maxLineLength, line.length + 4);
            }
        }
    } else {
        maxLineLength = Math.max(maxLineLength, String(err).length + 4);
    }

    const BOX_WIDTH = maxLineLength;
    const BOX_TOP = '┌' + '─'.repeat(BOX_WIDTH - 2) + '┐';
    const BOX_MIDDLE = '├' + '─'.repeat(BOX_WIDTH - 2) + '┤';
    const BOX_BOTTOM = '└' + '─'.repeat(BOX_WIDTH - 2) + '┘';
    const TITLE = '│' + 'ERROR OCCURRED'.padStart((BOX_WIDTH + 11) / 2).padEnd(BOX_WIDTH - 2) + '│';
    const ERROR_LABEL = '│ Error details:' + ' '.repeat(BOX_WIDTH - 17) + '│';

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

class djsClient {
    public client: Client & {
        messageCommands?: Collection<string, MessageCommandFile>,
        slashCommands?: Collection<string, SlashCommandFile>,
        buttons?: Collection<string, ButtonCommandFile>,
        djsClient?: djsClient
    };
    private buttonDirectoryName = 'buttons';
    private slashCommandDirectoryName = 'slash_commands';
    private messageCommandDirectoryName = 'messages';
    public allowedGuilds: Set<string | null> = new Set([]);
    private token = '';

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
    public ready() {
        if (this.client.isReady()) {
            return true;
        };

        return new Promise(resolve => {
            this.client.on('ready', () => {
                resolve(true);
            });
        });
    }
    /**
     * @param {Object} options - The configuration options for the client
     * @param {string} options.token - The Discord bot token
     * @param {boolean} [options.buttonOn=false] - Whether to enable button commands
     * @param {boolean} [options.slashCommandsOn=false] - Whether to enable slash commands
     * @param {boolean} [options.messageCommandsOn=false] - Whether to enable message commands
     * @param {string} [options.slashCommandDir] - Directory for slash commands
     * @param {string} [options.ButtonCommandDir] - Directory for button commands
     * @param {string} [options.messageCommandDir] - Directory for message commands
     * @param {('online'|'idle'|'dnd'|'invisible')} [options.status='online'] - Bot status
     * @param {string} [options.activityName] - Activity name for bot status
     * @param {string} [options.activityType='Playing'] - Activity type for bot status
     * @param {number} [options.restTimeout=25000] - REST API timeout
     * @param {(number|'auto'|readonly number[])} [options.sharding='auto'] - Sharding configuration
     * @param {Array} [options.intents] - Gateway intents
     * @param {Array} [options.partials] - Partial structures
     * @param {string} [options.prefex] - deprecated Use 'prefix' instead
     * @param {string} [options.prefix=''] - Command prefix
     * @param {boolean} [options.allowBots=false] - Allow bot interactions
     * @param {boolean} [options.allowDM=true] - Allow DM interactions
     * @param {boolean} [options.isPrivateBot=false] - Private bot mode
     * @param {Array} [options.allowedGuilds] - Allowed guild IDs
     * @param {Object} [options.consoleConfig] - Console configuration
     * @param {boolean} [options.consoleConfig.error=true] - Enable error logging
     * @param {boolean} [options.consoleConfig.warn=true] - Enable warning logging
     * @param {boolean} [options.consoleConfig.info=true] - Enable info logging
     * @param {boolean} [options.consoleConfig.debug=true] - Enable debug logging
     * @param {boolean} [options.consoleConfig.trace=true] - Enable trace logging
     * @param {boolean} [options.consoleConfig.log=true] - Enable log logging
     * @param {Object} [options.preCommandHook] - Pre-command hook
     */
    constructor({
        token,
        buttonOn = false,
        slashCommandsOn = false,
        messageCommandsOn = false,
        slashCommandDir,
        ButtonCommandDir,
        messageCommandDir,
        consoleConfig = {
            error: true,
            warn: true,
            info: true,
            debug: true,
            trace: true,
            log: true
        },
        status = 'online',
        activityName,
        activityType = 'Playing',
        restTimeout = 25000,
        sharding = 'auto',
        intents,
        partials,
        prefex,
        prefix = '',
        allowBots = false,
        allowDM = true,
        isPrivateBot = false,
        allowedGuilds,
        preCommandHook= {
            button: (buttonInteraction, callback) => {
                callback(buttonInteraction);
            },
            message: (message, callback) => {
                const args = message.content.split(' ');
                callback(message, args);
            },
            ready: () => {
                console.log('Bot is ready');
            },
            slashCommand: (command, callback) => {
                callback(command);
            }
        }
    }: {
        token: string;
        buttonOn?: boolean;
        slashCommandsOn?: boolean;
        messageCommandsOn?: boolean;
        slashCommandDir?: string;
        ButtonCommandDir?: string;
        messageCommandDir?: string;
        consoleConfig?: {
            error?: boolean;
            warn?: boolean;
            info?: boolean;
            debug?: boolean;
            trace?: boolean;
            log?: boolean;
        };
        status?: 'online' | 'idle' | 'dnd' | 'invisible';
        activityName?: string;
        activityType?: keyof typeof ActivityType;
        restTimeout?: number;
        sharding?: number | 'auto' | readonly number[];
        intents?: Exclude<keyof typeof GatewayIntentBits, GatewayIntentBits>[];
        partials?: (keyof typeof Partials)[];
        prefex?: string;
        prefix?: string;
        allowBots?: boolean;
        allowDM?: boolean;
        isPrivateBot?: boolean;
        allowedGuilds?: string[] | string | null;
        preCommandHook?: {
            ready?: () => void;
            message?: (message: MessageInteraction, callBack: (...args: [MessageInteraction, ...any]) => Promise<void> | void) => Promise<void> | void;
            slashCommand?: (command: SlashCommandInteraction, callBack: (...args: [SlashCommandInteraction, ...any]) => Promise<void> | void) => Promise<void> | void;
            button?: (command: ButtoncommandInteraction, callBack: (...args: [ButtoncommandInteraction, ...any]) => Promise<void> | void) => Promise<void> | void;
        }        
    }) {
        const selectedIntents = intents
            ? intents.map(intent => GatewayIntentBits[intent])
            : Object.values(GatewayIntentBits).filter((x): x is GatewayIntentBits => typeof x === 'number');

        const selectedPartials = partials
            ? partials.map(partial => Partials[partial])
            : Object.keys(Partials).map(key => Partials[key as keyof typeof Partials]);

        const fixedActivityType = ActivityType[activityType || 'Watching'];
        
        const console = {
            log: consoleConfig.log ? global.console.log : () => { },
            warn: consoleConfig.warn ? global.console.warn : () => { },
            error: consoleConfig.error ? global.console.error : () => { },
            info: consoleConfig.info ? global.console.info : () => { },
            debug: consoleConfig.debug ? global.console.debug : () => { },
        };

        if (allowedGuilds) {
            if (typeof allowedGuilds === 'string') {
                this.allowedGuilds = new Set([allowedGuilds]);
            } else if (Array.isArray(allowedGuilds)) {
                this.allowedGuilds = new Set(allowedGuilds);
            } else {
                this.allowedGuilds = new Set();
            }
        };

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

        this.client.djsClient = this;

        if (typeof token !== "string" || token.length < 59) {
            throw new Error(`Invalid token was been provided or mismatch intents. Error occurred at: ${new Error().stack?.split("\n")[2]?.trim() || "Unknown location"}\n
                }\n
  The error happened because the provided token was not a string or it's not well formatted as a Discord bot token!\n`);
        }

        this.client.buttons = new Collection<string, ButtonCommandFile>();
        this.client.slashCommands = new Collection<string, SlashCommandFile>();
        this.client.messageCommands = new Collection<string, MessageCommandFile>();

        if (prefex) {
            console.warn(`[djsify] The 'prefex' option is deprecated and will be removed in the next major release. Use 'prefix' instead.`);
        };
        const Prefix = prefix || prefex || '';

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
                    if (typeof command === 'object' && 'default' in command) {
                        command = command.default;
                    }
                    if (typeof command !== 'object') {
                        throw new Error(`Invalid command file: ${filePath}`);
                    }
                    const commandModule: moduleType = command;
                    const data = commandModule.data;
                    let result: string | string[] | undefined;
                    if (!data || typeof data !== 'object') {
                        throw new Error(`Invalid command file: ${filePath}`, { cause: new Error(`Invalid command file: ${filePath}`) });
                    };
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
                                commandModule.data.content = Prefix + commandModule.data.content;
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
                    commands.add(command.data);
                }
            });

            this.client.on('interactionCreate', async (i: Interaction & { client: Client<boolean> & { djsClient?: djsClient }, djsClient?: djsClient }) => {
                if (!i.isCommand()) return;

                const command = this.client?.slashCommands?.get(i.commandName);
                if (!command) return;

                if (isPrivateBot && (!i.guild || !this.allowedGuilds.has(i.guildId))) {
                    return i.isRepliable() && i.reply({
                        embeds: [{
                            title: `** This Server is not allowed to use this bot! **`,
                            color: Colors.Red
                        }]
                    });
                }

                try {
                    Object.assign(i.client, { djsClient: this });
                    Object.assign(i, { djsClient: this });
                    const callback = command.execute;
                    await preCommandHook?.slashCommand?.(i, callback);
                } catch (err) {
                    consoleConfig.error && consoleError(err as Error);
                    const errorMessage = {
                        content: `An error occurred while executing the command:`,
                        flags: 64,
                    };
                    try {
                        if (i.isRepliable() && !i.replied && !i.deferred) {
                            await i.reply(errorMessage);
                        } else if (i.replied && !i.deferred) {
                            await i.followUp(errorMessage);
                        } else if (i.deferred) {
                            await i.editReply(errorMessage);
                        }
                    } catch { /* Empty */ }
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

            this.client.on('interactionCreate', async (interaction: Interaction & { client: Client<boolean> & { djsClient?: djsClient }, djsClient?: djsClient }) => {
                if (!interaction.isButton()) return;
                const i = interaction as ButtoncommandInteraction;

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
                    if (!shouldExecute) return;
                    Object.assign(i, { djsClient: this });
                    Object.assign(i.client, { djsClient: this });
                    const callback = command.execute;
                    await preCommandHook?.button?.(i, callback);
                } catch (err) {
                    consoleConfig.error && consoleError(err as Error);
                    const errorMessage = {
                        content: `An error occurred while executing the command:`,
                        flags: 64,
                    };
                    try {
                        if (i.isRepliable() && !i.replied && !i.deferred) {
                            await i.reply(errorMessage);
                        } else if (i.replied && !i.deferred) {
                            await i.followUp(errorMessage);
                        } else if (i.deferred) {
                            await i.editReply(errorMessage);
                        }
                    } catch { /* Empty */ }
                }

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
            const allowedMessageCache = new Map<string, boolean>();
            this.client.on('messageCreate', async (m: OmitPartialGroupDMChannel<Message<boolean>> & { client: Client<boolean> & { djsClient?: djsClient }, djsClient?: djsClient }) => {
                if ((m.author.bot && m.author.id === this?.client?.user?.id) || (!allowBots && m.author.bot)) return;

                if (!allowDM && m.channel.type === ChannelType.DM) return;

                if (Prefix && !m.content.startsWith(Prefix)) return;

                const args = m.content.trim().split(/\s+/);
                const commandName = args[0].toLowerCase().replace(Prefix || '' as string, '');
                const command = this.client.messageCommands?.get(commandName);

                if (!command) return;

                try {
                    const cacheKey = `${commandName}-${command.data?.startsWith}-${command.data?.includes}-${command.data?.endsWith}`;
                    let shouldExecute = allowedMessageCache.get(cacheKey);
                    
                    if (shouldExecute === undefined) {
                        const contents = Array.isArray(command.data?.content) ? command.data.content : [command.data?.content];
                        
                        if (command.data?.startsWith) {
                            shouldExecute = contents.some(content => commandName.startsWith(content));
                        } else if (command.data?.includes) {
                            shouldExecute = contents.some(content => commandName.includes(content));
                        } else if (command.data?.endsWith) {
                            shouldExecute = contents.some(content => commandName.endsWith(content));
                        } else {
                            shouldExecute = contents.includes(commandName);
                        }
                        
                        allowedMessageCache.set(cacheKey, shouldExecute);
                    }
                    
                    if (!shouldExecute)
                        return;
                    if (Warned.has(m.author.id))
                        return;
                    if (isPrivateBot && (!m?.guild || !this.allowedGuilds?.has(m?.guildId))) {
                        Warned.add(m.author.id);
                        return m.reply({
                            embeds: [{
                                title: `** This Server is not allowed to use this bot! **`,
                                color: Colors.Red
                            }]
                        });
                    }
                    
                    m.client.djsClient = this;
                    m.djsClient = this;
                    const callback = command.execute;
                    await preCommandHook?.message?.(m, callback);
                } catch (err) {
                    consoleConfig.error && consoleError(err as Error);
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
        } catch {
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

export default djsClient;