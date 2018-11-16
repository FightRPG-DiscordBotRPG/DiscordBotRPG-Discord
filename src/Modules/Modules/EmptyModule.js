const GModule = require("../GModule");


class NonameModule extends GModule {
    constructor() {
        super();
        this.commands = ["command1"];
        this.startLoading("Noname");
        this.init();
        this.endLoading("Noname");
    }

    async run(message, command, args) {
        let msg = "";
        let authorIdentifier = message.author.id;

        switch (command) {

        }

        this.sendMessage(message, msg);
    }
}

module.exports = NonameModule;