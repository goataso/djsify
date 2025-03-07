import { MessageCommandFile } from "../type/MessageCommandFile.js";
import { SlashCommandFile } from "../type/SlashCommandFile.js";
import { ButtonCommandFile } from "../type/ButtonCommandFile.js";
import { ActivityType, Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { ButtoncommandInteraction, MessageInteraction, SlashCommandInteraction } from '../type/Commands.js';
declare class djsClient {
    client: Client & {
        messageCommands?: Collection<string, MessageCommandFile>;
        slashCommands?: Collection<string, SlashCommandFile>;
        buttons?: Collection<string, ButtonCommandFile>;
        djsClient?: djsClient;
    };
    private buttonDirectoryName;
    private slashCommandDirectoryName;
    private messageCommandDirectoryName;
    allowedGuilds: Set<string | null>;
    private token;
    addAllowedGuilds(guildId: string): Set<string | null>;
    getAllowedGuilds(): (string | null)[];
    setSlashCommandDir(dirname: string): Promise<void>;
    setButtonCommandsDir(dirname: string): Promise<void>;
    setMessageCommandDir(dirname: string): Promise<void>;
    setStatus(status: 'online' | 'idle' | 'dnd' | 'invisible'): Promise<void>;
    setActivity(name: string, type: ActivityType): Promise<void>;
    reload(): Promise<void>;
    ready(): true | Promise<unknown>;
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
     */
    constructor({ token, buttonOn, slashCommandsOn, messageCommandsOn, slashCommandDir, ButtonCommandDir, messageCommandDir, consoleConfig, status, activityName, activityType, restTimeout, sharding, intents, partials, prefex, prefix, allowBots, allowDM, isPrivateBot, allowedGuilds, preCommandHook }: {
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
        allowedGuilds: string[] | string | null;
        preCommandHook: {
            ready?: () => void;
            message?: (message: MessageInteraction, callBack: (...args: [MessageInteraction, ...any]) => Promise<void> | void) => Promise<void> | void;
            slashCommand?: (command: SlashCommandInteraction, callBack: (...args: [SlashCommandInteraction, ...any]) => Promise<void> | void) => Promise<void> | void;
            button?: (command: ButtoncommandInteraction, callBack: (...args: [ButtoncommandInteraction, ...any]) => Promise<void> | void) => Promise<void> | void;
        };
    });
}
export default djsClient;
