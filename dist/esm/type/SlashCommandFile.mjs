import { CommandInteraction } from "discord.js";

class SlashCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {(interaction: CommandInteraction) => Promise<void> | void} execute - The execute function
     */
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
};

export { SlashCommandFile };
