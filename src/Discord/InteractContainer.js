const Discord = require("discord.js");

class InteractContainer {
    constructor() {
        /**
         * @type {Discord.Message}
         */
        this.message = null;
        /**
         * @type {Discord.User}
         */
        this.author = null;
        /**
         * @type {Discord.Channel}
         */
        this.channel = null;

        /**
         * @type {Discord.CommandInteraction}
         */
        this.interaction = null;

        /**
         * @type {Discord.Guild}
         */
        this.guild = null;

        /**
         * @type {Discord.Client}
         */
        this.client = null;

        /**
         * @type {Discord.Collection<string, Discord.User>}
         */
        this.mentions = new Discord.Collection();

        this.args = [];

    }

    async reply(data) {
        if (this.message) {
            return await this.message.reply(data);
        }

        if (this.interaction) {
            return await this.interaction.reply(data);
        }
    }
}

module.exports = InteractContainer;

