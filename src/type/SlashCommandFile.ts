import SlashType from "./SlashType.js";
import { SlashCommandInteraction } from "./Commands.js";

class SlashCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {Function} execute - The execute function
     */
    constructor(data: SlashType, execute: (interaction: SlashCommandInteraction) => Promise<void> | void) {
        this.data = data;
        this.execute = execute;
    }

    declare data: SlashType;
    declare execute: (interaction: SlashCommandInteraction) => Promise<void> | void;
};

export { SlashCommandFile };