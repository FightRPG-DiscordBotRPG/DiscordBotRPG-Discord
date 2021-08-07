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
         * @type {Discord.TextChannel}
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

        /**
         * @type {string}
         **/
        this.command = null;

    }

    async reply(data) {
        if (this.message) {
            return await this.message.reply(data);
        }

        if (this.interaction) {
            if (typeof data == "object") {
                data = { ...data, fetchReply: true };
            } else {
                data = { content: data, fetchReply: true };
            }
            return await this.interaction.reply(data);
        }
    }
}

module.exports = InteractContainer;

