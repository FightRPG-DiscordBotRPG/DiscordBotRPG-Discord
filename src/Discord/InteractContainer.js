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

    /**
     * 
     * @param {Discord.ReplyMessageOptions} data
     * @returns {Promise<Discord.Message>}
     */
    async reply(data) {

        if (this.interaction) {
            if (!this.interaction.replied && !this.interaction.deferred) {
                return await this.interaction.reply(InteractContainer.getReplyOptions(data));
            } else {
                return await this.interaction.editReply(InteractContainer.getReplyOptions(data));
            }
        }

        if (this.message) {
            return await this.message.reply(data);
        }
    }

    /**
     * 
     * @returns {Discord.ReplyMessageOptions}
     */
    getReplyOptions(data) {
        return InteractContainer.getReplyOptions(data);
    }

    /**
     *
     * @returns {Discord.ReplyMessageOptions}
     */
    static getReplyOptions(data) {
        if (typeof data == "object") {
            if (data.fields) {
                return { fetchReply: true, components: [], embeds: [data] };
            } else {

                return { components: [], embeds: [], fetchReply: true, ...data, };
            }
        } else {
            return { fetchReply: true, components: [], embeds: [], content: data, };
        }
    }
}

module.exports = InteractContainer;

