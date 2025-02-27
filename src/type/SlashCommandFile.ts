import { CommandInteraction } from "discord.js";
import SlashType from "./SlashType.js";

class SlashCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {Function} execute - The execute function
     */
    constructor(data: SlashType, execute: (interaction: CommandInteraction) => Promise<void> | void) {
        this.data = data;
        this.execute = execute;
    }

    declare data: SlashType;
    declare execute: (interaction: CommandInteraction) => Promise<void> | void;
};

export { SlashCommandFile };