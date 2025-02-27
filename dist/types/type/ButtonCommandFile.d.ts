import { ButtonInteraction } from "discord.js";
declare class ButtonCommandFile {
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
    }, execute: (interaction: ButtonInteraction) => Promise<void> | void);
    data: {
        customId: string;
        startsWith: boolean;
        includes: boolean;
        endsWith: boolean;
    };
    execute: (interaction: ButtonInteraction) => Promise<void> | void;
}
export { ButtonCommandFile };
