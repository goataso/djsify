class ButtonCommandFile {
    /**
     * @readonly
     * @param {object} data - The command data
     * @param {(interaction: ButtonInteraction) => Promise<void> | void} execute - The execute function
     */
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
}
;
export { ButtonCommandFile };
