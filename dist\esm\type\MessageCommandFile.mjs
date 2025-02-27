import { Message } from "discord.js";

class MessageCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {(interaction: Message) => Promise<void> | void} execute - The execute function
     */
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
}
;
export { MessageCommandFile };
