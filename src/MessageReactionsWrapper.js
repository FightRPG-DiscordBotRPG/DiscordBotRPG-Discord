const Discord = require("discord.js");

class MessageReactionsWrapper {
    /**
    * Settings with reactions callbacks
    * @typedef {Object} SettingsMessageReact
    * @property {Array<string>} reactionsEmojis Items be result of Emojis.getString()
    * @property {Discord.ReactionCollectorOptions=} collectorOptions time in ms and max as number
    */

    constructor() {
        this.message = null;
        this.collector = null;
        this.isDM = true;
        this.currentMessageReactions = [];
    }


    /**
    * @param {Discord.Message} messageDiscord
    * @param {string} content
    * @param {SettingsMessageReact} settings
    */
    async load(messageDiscord, content, settings) {
        this.message = await messageDiscord.channel.send(content);

        this.isDM = messageDiscord.channel.type == "dm";
        this.currentMessageReactions = [];

        if (this.message == null) {
            return;
        }

        if (!this.message.deleted) {
            await this.setReactionsEmojis(settings.reactionsEmojis);
        }


        /**
         * 
         * @param {Discord.MessageReaction} reaction
         * @param {Discord.User} user
         */
        const filter = (reaction, user) => {
            return settings.reactionsEmojis.includes(reaction.emoji.name) && user.id === messageDiscord.author.id;
        };

        this.collector = this.message.createReactionCollector(filter, settings.collectorOptions);

        this.collector.on('end', async (reactions, reason) => {
            if (!this.message.deleted) {
                if (!this.isDM) {
                    this.message.reactions.removeAll();
                } else {
                    for (let i in this.currentMessageReactions) {
                        if (typeof this.currentMessageReactions[i].remove === "function") {
                            this.currentMessageReactions[i] = this.currentMessageReactions[i].remove();
                        }
                    }
                }
            }
        });
    }

    /**
     * 
     * @param {string} message
     * @param {Array<string>=} arrOfEmojis
     */
    async edit(content, arrOfEmojis) {

        if (content != null && !this.message.deleted) {
            await this.clearEmojis();
            await this.message.edit(content);
            await this.setReactionsEmojis(arrOfEmojis != null ? arrOfEmojis : []);
        }
    }

    /**
     * 
     * @param {Array<string>} arrOfEmojis
     * @param {boolean} clear
     */
    async setReactionsEmojis(arrOfEmojis, clear = false) {
        if (clear) {
            await this.clearEmojis();
        }
        for (let emojiName of arrOfEmojis) {
            this.currentMessageReactions.push(await this.message.react(emojiName));
        }
    }

    async clearEmojis() {
        if (this.isDM) {
            for (let i in this.currentMessageReactions) {
                currentMessageReactions[i] = currentMessageReactions[i].remove();
            }
            await Promise.all(currentMessageReactions);
        } else {
            await this.message.reactions.removeAll();
        }

        this.currentMessageReactions = [];
    }
}


module.exports = MessageReactionsWrapper;