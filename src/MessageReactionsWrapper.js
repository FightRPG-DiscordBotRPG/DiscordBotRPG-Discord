const Discord = require("discord.js");

class MessageReactionsWrapper {
    /**
    * Settings with reactions callbacks
    * @typedef {Object} SettingsMessageReact
    * @property {Array<string>} reactionsEmojis Items be result of Emojis.getString()
    * @property {Discord.ReactionCollectorOptions=} collectorOptions time in ms and max as number
    * @property {boolean=} waitForEmojis If the collector needs to wait for emojis before listening
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

        if (!this.message.deleted && settings.reactionsEmojis != null) {
            let promiseEmojis = this.setReactionsEmojis(settings.reactionsEmojis);
            if (settings.waitForEmojis == null || settings.waitForEmojis === true) {
                await promiseEmojis;
            }
        }


        /**
         * 
         * @param {Discord.MessageReaction} reaction
         * @param {Discord.User} user
         */
        const filter = (reaction, user) => {
            return (user.id === messageDiscord.author.id && (this.currentEmojiReactList.includes(reaction.emoji.name) || this.currentEmojiReactList.includes(reaction.emoji.id) || this.currentEmojiReactList.find(e => e.id === reaction.emoji.id)));
        };

        this.collector = this.message.createReactionCollector(filter, settings.collectorOptions);

        this.collector.on('end', async () => {
            await new Promise(res => setTimeout(res, 1000));
            await this.clearEmojis();
        });
    }

    /**
     * 
     * @param {string} content
     * @param {Array<string>=} arrOfEmojis
     * @param {boolean=} clearEmojis
     */
    async edit(content, arrOfEmojis, clearEmojis=true) {
        if (content != null && !this.message.deleted) {
            if (clearEmojis) {
                await this.clearEmojis();
            }
            await this.message.edit(content);
            await this.setReactionsEmojis(arrOfEmojis != null ? arrOfEmojis : []);
        }
    }

    resetCollectListener() {
        if (this.collector.listenerCount("collect") > 0) {
            this.collector.removeAllListeners("collect");
        }
    }

    async removeEmbed() {
        if (!this.isDM) {
            await this.message.suppressEmbeds(true);
        }
    }

    async deleteAndSend(content) {
        this.resetCollectListener();
        await this.message.delete();
        this.message.channel.send(content);
    }

    /**
     * 
     * @param {Array<string> | Array<{id: number, string: string}>} arrOfEmojis
     * @param {boolean} clear
     */
    async setReactionsEmojis(arrOfEmojis, clear = false) {
        if (clear) {
            await this.clearEmojis();
        }
        for (let emoji of arrOfEmojis) {
            if (emoji != null) {
                await this.addEmoji(emoji);
            }
        }
    }

    /**
     * 
     * @param {string | {id: number, string: string}} emojiIdentifier
     */
    async addEmoji(emojiIdentifier) {
        if (this.message.deleted) {
            return;
        }
        try {
            this.currentMessageReactions.push(await this.message.react(emojiIdentifier.id != null ? emojiIdentifier.string : emojiIdentifier));
            this.currentEmojiReactList.push(emojiIdentifier);
        } catch (e) { /* Do noting cause the message is maybe deleted */ }

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
            if (!this.message.deleted) {
                await this.message.reactions.removeAll();
            }
        }

        this.currentMessageReactions = [];
        this.currentEmojiReactList = [];
    }
}


module.exports = MessageReactionsWrapper;