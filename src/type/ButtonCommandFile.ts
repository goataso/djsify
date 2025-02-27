import { ButtonInteraction } from "discord.js";

class ButtonCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {Function} execute - The execute function
     */
    constructor(data: {
        customId: string;
        startsWith: boolean;
        includes: boolean;
        endsWith: boolean;
    }, execute: (interaction: ButtonInteraction) => Promise<void> | void) {
        this.data = data;
        this.execute = execute;
    }

    declare data: {
        customId: string;
        startsWith: boolean;
        includes: boolean;
        endsWith: boolean;
    };
    declare execute: (interaction: ButtonInteraction) => Promise<void> | void;
};

export { ButtonCommandFile };