import { CommandInteraction } from "discord.js";
import SlashType from "./SlashType.js";
declare class SlashCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {Function} execute - The execute function
     */
    constructor(data: SlashType, execute: (interaction: CommandInteraction) => Promise<void> | void);
    data: SlashType;
    execute: (interaction: CommandInteraction) => Promise<void> | void;
}
export { SlashCommandFile };
