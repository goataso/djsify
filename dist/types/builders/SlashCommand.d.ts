import { ApplicationCommandOptionType, APIApplicationCommandOptionChoice, APIApplicationCommandBasicOption, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
interface BaseOption {
    name: string;
    description: string;
    required?: boolean;
}
interface StringOption extends BaseOption {
    type: ApplicationCommandOptionType.String;
    choices?: APIApplicationCommandOptionChoice<string>[];
}
interface IntegerOption extends BaseOption {
    type: ApplicationCommandOptionType.Integer;
    choices?: APIApplicationCommandOptionChoice<number>[];
    min_value?: number;
    max_value?: number;
}
interface NumberOption extends BaseOption {
    type: ApplicationCommandOptionType.Number;
    choices?: APIApplicationCommandOptionChoice<number>[];
    min_value?: number;
    max_value?: number;
}
interface BooleanOption extends BaseOption {
    type: ApplicationCommandOptionType.Boolean;
}
interface UserOption extends BaseOption {
    type: ApplicationCommandOptionType.User;
}
interface ChannelOption extends BaseOption {
    type: ApplicationCommandOptionType.Channel;
}
interface RoleOption extends BaseOption {
    type: ApplicationCommandOptionType.Role;
}
interface MentionableOption extends BaseOption {
    type: ApplicationCommandOptionType.Mentionable;
}
interface AttachmentOption extends BaseOption {
    type: ApplicationCommandOptionType.Attachment;
}
interface SubcommandOption extends BaseOption {
    type: ApplicationCommandOptionType.Subcommand;
    options?: APIApplicationCommandBasicOption[];
}
interface SubcommandGroupOption extends BaseOption {
    type: ApplicationCommandOptionType.SubcommandGroup;
    options?: APIApplicationCommandBasicOption[];
}
type Option = StringOption | IntegerOption | NumberOption | BooleanOption | UserOption | ChannelOption | RoleOption | MentionableOption | AttachmentOption | SubcommandOption | SubcommandGroupOption;
export declare class SlashCommand {
    private name;
    private description;
    private options;
    private dm_permission?;
    private default_member_permissions?;
    setName(name: string): this;
    setDescription(description: string): this;
    addOption(option: Partial<Option>): this;
    toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}
export declare enum OptionType {
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
    SUBCOMMAND = 1,
    SUBCOMMAND_GROUP = 2
}
export {};
