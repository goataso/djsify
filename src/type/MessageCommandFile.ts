import { MessageInteraction } from "./Commands.js";

class MessageCommandFile {
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
    }, execute: (message: MessageInteraction, ...args: any[]) => Promise<void> | void) {
        this.data = data;
        this.execute = execute;
    }

    declare data: {
        content: string | string[];
        startsWith?: boolean;
        includes?: boolean;
        endsWith?: boolean;
    };
    declare execute: (message: MessageInteraction, ...args: any[]) => Promise<void> | void;
};

export { MessageCommandFile };