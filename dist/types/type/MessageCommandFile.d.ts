import { MessageInteraction } from "./Commands.js";
declare class MessageCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {Function} execute - The execute function
     */
    constructor(data: {
        content: string | string[];
        startsWith?: boolean;
        includes?: boolean;
        endsWith?: boolean;
    }, execute: (message: MessageInteraction, ...args: any[]) => Promise<void> | void);
    data: {
        content: string | string[];
        startsWith?: boolean;
        includes?: boolean;
        endsWith?: boolean;
    };
    execute: (message: MessageInteraction, ...args: any[]) => Promise<void> | void;
}
export { MessageCommandFile };
