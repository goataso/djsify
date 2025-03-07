import { ButtoncommandInteraction } from "./Commands.js";
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
    }, execute: (interaction: ButtoncommandInteraction, ...others: any[]) => Promise<void> | void);
    data: {
        customId: string;
        startsWith: boolean;
        includes: boolean;
        endsWith: boolean;
    };
    execute: (interaction: ButtoncommandInteraction) => Promise<void> | void;
}
export { ButtonCommandFile };
