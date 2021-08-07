const GModule = require("../GModule");


class NonameModule extends GModule {
    constructor() {
        super();
        this.commands = ["command1"];
        this.startLoading("Noname");
        this.init();
        this.endLoading("Noname");
    }

    /**
     *
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {Array} args
     */
    async run(interact, command, args) {
        let msg = "";
        let authorIdentifier = interact.author.id;

        switch (command) {

        }

        this.sendMessage(interact, msg, command);
    }
}

module.exports = NonameModule;