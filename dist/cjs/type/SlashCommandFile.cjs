"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandFile = void 0;
class SlashCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {Function} execute - The execute function
     */
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
}
exports.SlashCommandFile = SlashCommandFile;
;
