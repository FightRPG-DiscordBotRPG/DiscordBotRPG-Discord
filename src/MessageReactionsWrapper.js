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
        this.currentEmojiReactList = [];
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
            return (this.currentEmojiReactList.includes(reaction.emoji.name) || this.currentEmojiReactList.includes(reaction.emoji.id) ) && user.id === messageDiscord.author.id;
        };

        this.collector = this.message.createReactionCollector(filter, settings.collectorOptions);

        this.collector.on('end', async (reactions, reason) => {
            if (!this.message.deleted) {
                if (!this.isDM) {
                    this.message.reactions.removeAll();
                } else {
                    // Do nothing for now due to bug in dm
                    //for (let i in this.currentMessageReactions) {
                    //    if (typeof this.currentMessageReactions[i].remove === "function" && this.currentMessageReactions[i].me) {
                    //        this.currentMessageReactions[i] = this.currentMessageReactions[i].remove();
                    //    }
                    //}
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
            this.currentEmojiReactList.push(emojiName);
        }
    }

    async clearEmojis() {
        if (this.isDM) {
            // Can't remove in dm for now
            //for (let i in this.currentMessageReactions) {
            //    if (this.currentMessageReactions[i].me) {
            //        this.currentMessageReactions[i] = this.currentMessageReactions[i].remove();
            //    }

            //}
            //await Promise.all(this.currentMessageReactions);
        } else {
            await this.message.reactions.removeAll();
        }

        this.currentMessageReactions = [];
        this.currentEmojiReactList = [];
    }
}


module.exports = MessageReactionsWrapper;