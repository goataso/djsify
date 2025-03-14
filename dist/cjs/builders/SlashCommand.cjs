"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionType = exports.SlashCommand = void 0;
class SlashCommand {
    name = "";
    description = "";
    options = [];
    dm_permission;
    default_member_permissions;
    setName(name) {
        if (!name)
            throw new Error("Command name is required");
        this.name = name;
        return this;
    }
    setDescription(description) {
        if (!description)
            throw new Error("Error : Command description is required at \n" +
                new Error().stack?.split("\n")[2]?.trim());
        this.description = description;
        return this;
    }
    addOption(option) {
        if (!option.name || !option.type || !option.description)
            throw new Error(`Error : Option name, type, and description are required in \n${new Error().stack
                ?.split("\n")[2]
                ?.trim()}`);
        this.options.push({ ...option, required: option.required ?? false });
        return this;
    }
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            dm_permission: this.dm_permission,
            default_member_permissions: this.default_member_permissions
        };
    }
}
exports.SlashCommand = SlashCommand;
;
var OptionType;
(function (OptionType) {
    OptionType[OptionType["STRING"] = 3] = "STRING";
    OptionType[OptionType["INTEGER"] = 4] = "INTEGER";
    OptionType[OptionType["BOOLEAN"] = 5] = "BOOLEAN";
    OptionType[OptionType["USER"] = 6] = "USER";
    OptionType[OptionType["CHANNEL"] = 7] = "CHANNEL";
    OptionType[OptionType["ROLE"] = 8] = "ROLE";
    OptionType[OptionType["MENTIONABLE"] = 9] = "MENTIONABLE";
    OptionType[OptionType["NUMBER"] = 10] = "NUMBER";
    OptionType[OptionType["ATTACHMENT"] = 11] = "ATTACHMENT";
    OptionType[OptionType["SUBCOMMAND"] = 1] = "SUBCOMMAND";
    OptionType[OptionType["SUBCOMMAND_GROUP"] = 2] = "SUBCOMMAND_GROUP";
})(OptionType || (exports.OptionType = OptionType = {}));
;
