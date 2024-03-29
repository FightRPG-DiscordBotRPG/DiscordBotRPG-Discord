const Discord = require("discord.js");
const InteractContainer = require("./Discord/InteractContainer");

class MessageReactionsWrapper {
    /**
    * Settings with reactions callbacks
    * @typedef {Object} SettingsMessageReact
    * @property {Array<string>} reactionsEmojis Items be result of Emojis.getString()
    * @property {Discord.InteractionCollectorOptions=} collectorOptions time in ms and max as number
    * @property {boolean=} waitForEmojis If the collector needs to wait for emojis before listening
    */

    constructor() {
        /**
         * @type Discord.Message
         **/
        this.message = null;
        /**
         * @type {Discord.InteractionCollector}
         **/
        this.collector = null;
        this.isDM = true;
        this.currentMessageReactions = [];
        this.currentIdentifiersReactList = [];
        this.willBeDeleted = false;
    }


    /**
    * @param {InteractContainer} interact
    * @param {Discord.MessageOptions | string} content
    * @param {SettingsMessageReact} settings
    */
    async load(interact, content, settings) {
        if (content.fields) {
            content = { embeds: [content] };
        }

        this.message = await interact.reply(content);

        this.isDM = interact.channel.type == "DM";
        this.currentMessageReactions = [];

        if (this.message == null) {
            return;
        }

        if (this.message.deletable && settings.reactionsEmojis != null) {
            await this.setReactionsEmojis(settings.reactionsEmojis);
        }

        /**
         * 
         * @param {Discord.MessageComponentInteraction} interaction
         */
        const filter = (interaction) => {
            return (interaction.user.id === interact.author.id && (this.currentIdentifiersReactList.includes(interaction.customId)));
        };
        //const filter = (interaction) => {
        //    return (interaction.user.id === interact.author.id && (this.currentEmojiReactList.includes(interaction.customId)));
        //};

        //this.collector = this.message.createReactionCollector({ filter, ...settings.collectorOptions });
        const collectorOptions = { filter, ...settings.collectorOptions };
        this.collector = this.message.createMessageComponentCollector(collectorOptions);
        //console.log(this.collector);

        this.collector.on('end', async () => {
            await new Promise(res => setTimeout(res, 1000));
            await this.clearEmojis();
        });
    }

    /**
     * 
     * @param {Discord.MessageOptions} content
     * @param {Discord.ButtonInteraction} interaction
     * @param {Array<string>=} arrOfEmojis
     * @param {boolean=} clearEmojis
     */
    async edit(content, interaction, arrOfEmojis) {
        if (content != null && this.message.deletable) {
            //if (clearEmojis) {
            //    await this.clearEmojis();
            //}
            await this.setReactionsEmojis(arrOfEmojis != null ? arrOfEmojis : []);


            const options = InteractContainer.getReplyOptions(content);
            if (interaction?.update) {
                if (interaction.replied) {
                    await interaction.editReply(options);
                } else {
                    this.message = await interaction.update(options);
                }
            } else {
                this.message.edit(options);
            }
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

    /**
     * 
     * @param {Discord.MessageEmbed | string} content
     * @param {Discord.ButtonInteraction} interaction
     */
    async deleteAndSend(content, interaction) {
        this.willBeDeleted = true;
        this.resetCollectListener();
        if (content.fields) {
            content = { fields: [content] };
        } else {
            content = { content: content };
        }

        await interaction.reply(content);
        await this.message.delete();
    }

    /**
     * 
     * @param {Array<string> | Array<{id: number, string: string}>} arrOfEmojis
     * @param {boolean} clear
     */
    async setReactionsEmojis(arrOfEmojis, clear = false) {
        //if (clear) {
        //    await this.clearEmojis();
        //}
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
        if (!this.message.deletable) {
            return;
        }
        try {
            this.currentIdentifiersReactList.push(emojiIdentifier);
        } catch (e) { /* Do noting cause the message is maybe deleted */ }

    }

    async clearEmojis() {
        if (this.message.deletable && !this.willBeDeleted) {
            try {
                await this.message.edit({
                    content: this.message.content != "" ? this.message.content : null,
                    components: [],
                    embeds: this.message.embeds ?? null,
                    attachments: this.message.attachments,
                });
                //await this.message.delete();
            } catch (e) {
                console.log(e);
                /* We don't care if not deleted */
            };
        }

        this.currentMessageReactions = [];
        this.currentIdentifiersReactList = [];
    }
}


module.exports = MessageReactionsWrapper;