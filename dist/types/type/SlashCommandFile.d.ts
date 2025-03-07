import SlashType from "./SlashType.js";
import { SlashCommandInteraction } from "./Commands.js";
declare class SlashCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {Function} execute - The execute function
     */
    constructor(data: SlashType, execute: (interaction: SlashCommandInteraction) => Promise<void> | void);
    data: SlashType;
    execute: (interaction: SlashCommandInteraction) => Promise<void> | void;
}
export { SlashCommandFile };
