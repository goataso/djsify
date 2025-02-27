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
}
interface ChoicesOptions {
  name: string;
  value: string;
}
interface Option {
  type: OptionType | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  name: string;
  description: string;
  required?: boolean;
  choices?: ChoicesOptions;
}
export class SlashCommand {
  private name: string = "";
  private description: string = "";
  private options: Option[] = [];

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

  public addOption(option: Option): this {
    if (!option.name || !option.type || !option.description)
      throw new Error(
        `Error : Option name, type, and description are required in \n${new Error().stack
          ?.split("\n")[2]
          ?.trim()}`
      );
    const typeMap: { [key: string]: number } = {
      'STRING': 3,
      'INTEGER': 4,
      'BOOLEAN': 5,
      'USER': 6,
      'CHANNEL': 7,
      'ROLE': 8,
      'MENTIONABLE': 9,
      'NUMBER': 10,
      'ATTACHMENT': 11,
      'SUBCOMMAND': 1,
      'SUBCOMMAND_GROUP': 2
    };
    const numericType = typeMap[option.type] || option.type;
    if (numericType === undefined) {
      throw new Error(`Invalid option type: ${option.type}`);
    }
    this.options.push({ ...option, type: numericType as any, required: option.required ?? false });
    return this;
  }
  public toJSON(): { name: string; description: string; options: Option[] } {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}