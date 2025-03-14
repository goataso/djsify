import { ApplicationCommandOptionType, APIApplicationCommandOptionChoice, APIApplicationCommandBasicOption, RESTPostAPIApplicationCommandsJSONBody, APIApplicationCommandOption } from "discord.js";

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

export class SlashCommand {  
  private name: string = "";
  private description: string = "";
  private options: APIApplicationCommandOption[] = [];
  private dm_permission?: boolean;
  private default_member_permissions?: string | null;

  public setName(name: string): this {
    if (!name) throw new Error("Command name is required");
    this.name = name;
    return this;
  }

  public setDescription(description: string): this {
    if (!description)
      throw new Error(
        "Error : Command description is required at \n" +
        new Error().stack?.split("\n")[2]?.trim()
      );
    this.description = description;
    return this;
  }

  public addOption(option: Partial<Option>): this {
    if (!option.name || !option.type || !option.description)
      throw new Error(
        `Error : Option name, type, and description are required in \n${new Error().stack
          ?.split("\n")[2]
          ?.trim()}`
      );
    this.options.push({ ...option, required: option.required ?? false } as APIApplicationCommandOption);
    return this;
  }

  public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
      dm_permission: this.dm_permission,
      default_member_permissions: this.default_member_permissions
    };
  }
};
export enum OptionType {
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
};
