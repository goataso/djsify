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
export declare class SlashCommand {
    private name;
    private description;
    private options;
    setName(name: string): this;
    setDescription(description: string): this;
    addOption(option: Option): this;
    toJSON(): {
        name: string;
        description: string;
        options: Option[];
    };
}
export {};
