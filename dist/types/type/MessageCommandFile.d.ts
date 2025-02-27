import { Message } from "discord.js";
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
    }, execute: (message: Message) => Promise<void> | void);
    data: {
        content: string | string[];
        startsWith?: boolean;
        includes?: boolean;
        endsWith?: boolean;
    };
    execute: (message: Message) => Promise<void> | void;
}
export { MessageCommandFile };
