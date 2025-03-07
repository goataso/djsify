"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonCommandFile = void 0;
class ButtonCommandFile {
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
exports.ButtonCommandFile = ButtonCommandFile;
;
