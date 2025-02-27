import { MessageCommandFile } from "src/type/MessageCommandFile";
import { SlashCommandFile } from "src/type/SlashCommandFile";
import { ButtonCommandFile } from "src/type/ButtonCommandFile";
import { ActivityType, Client, Collection, GatewayIntentBits, Partials } from "discord.js";
export declare class djsClient {
    client: Client & {
        messageCommands?: Collection<string, MessageCommandFile>;
        slashCommands?: Collection<string, SlashCommandFile>;
        buttons?: Collection<string, ButtonCommandFile>;
    };
    private buttonDirectoryName;
    private slashCommandDirectoryName;
    private messageCommandDirectoryName;
    private token;
    allowedGuilds: Set<string | null>;
    addAllowedGuilds(guildId: string): Set<string | null>;
    getAllowedGuilds(): (string | null)[];
    setSlashCommandDir(dirname: string): Promise<void>;
    setButtonCommandsDir(dirname: string): Promise<void>;
    setMessageCommandDir(dirname: string): Promise<void>;
    setStatus(status: 'online' | 'idle' | 'dnd' | 'invisible'): Promise<void>;
    setActivity(name: string, type: ActivityType): Promise<void>;
    reload(): Promise<void>;
    constructor({ token, buttonOn, slashCommandsOn, messageCommandsOn, slashCommandDir, ButtonCommandDir, messageCommandDir, status, activityName, activityType, restTimeout, sharding, intents, partials, prefex, allowBots, allowDM, isPrivateBot, }: {
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
    });
}
