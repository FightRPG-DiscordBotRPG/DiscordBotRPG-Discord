const { Message, MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction, Emoji } = require("discord.js");
const InteractContainer = require("../Discord/InteractContainer");
const Emojis = require("../Drawings/Emojis");
const Globals = require("../Globals");
const MessageReactionsWrapper = require("../MessageReactionsWrapper");
const Translator = require("../Translator/Translator");
const User = require("../Users/User");
const Utils = require("../Utils");

class UserChallenge {

    /**
     * 
     * @param {User} user
     */
    constructor(user) {
        this.mustAnswer = false;
        this.answer = null;
        /**
         * @type Array<CommandLog>
         **/
        this.commands = [];
        this.lengthToCheck = 0;
        this.updateLengthCheck();
        this.missedChallenges = 0;
        this.lastMissedChallenge = 0;
        this.user = user;
        this.challengeMessageUrl = null;
    }

    isTimeout() {
        return this.lastMissedChallenge + 60000 * Globals.antiSpamMinutesOfBan > Date.now();
    }
    /**
     * 
     * @param {InteractContainer} interact
     * @param {Array<string>} command
     */
    async manageIncomingCommand(interact, command) {
        this.commands.push(new CommandLog(command, Date.now()));
        let lang = this.user.lang;

        if (this.commands.length >= this.lengthToCheck && !this.mustAnswer && !this.isTimeout()) {
            this.mustAnswer = true;
            let answersNames = Utils.getRandomItemsInArray(Object.keys(Emojis.general), 4);
            this.answer = Utils.getRandomItemsInArray(answersNames, 1)[0];



            const options = InteractContainer.getReplyOptions(this.getEmbed(Translator.getString(lang, "antispam", "select_emoji", [Emojis.general[this.answer] + " (" + this.answer + ")"])));

            const actionRow = new MessageActionRow();


            for (let emojiName of answersNames) {
                actionRow.addComponents(
                    new MessageButton()
                        .setCustomId(emojiName)
                        .setLabel(emojiName)
                        .setStyle(this.answer === emojiName ? "SUCCESS" : "DANGER")
                        .setEmoji(Emojis.general[emojiName])
                )
            }


            options.components.push(
                actionRow
            );

            let wrapper = new MessageReactionsWrapper();

            await wrapper.load(interact, options, { reactionsEmojis: answersNames, collectorOptions: { time: 60000 }, waitForEmojis: false });

            this.challengeMessageUrl = wrapper.message.url;

            wrapper.collector.on("collect",
                /**
                 * 
                 * @param {ButtonInteraction} reaction
                 */
                async (reaction) => {
                    switch (reaction.customId) {
                        case this.answer:
                            this.mustAnswer = false;
                            this.commands = [];
                            this.updateLengthCheck();
                            this.missedChallenges = 0;
                            wrapper.collector.stop("end");
                            break;
                        default:
                            await reaction.reply(Translator.getString(this.user.lang, "general", "no"));
                            break;
                    }
                });

            wrapper.collector.on("end", async (collected, reason) => {
                if (this.mustAnswer) {
                    this.missedChallenges++;

                    if (this.missedChallenges === Globals.antiSpamNumberOfTries) {
                        await wrapper.edit(this.getEmbed(Translator.getString(lang, "errors", "antispam_end", [Globals.antiSpamMinutesOfBan])));
                        this.missedChallenges = 0;
                        this.lastMissedChallenge = Date.now();
                    } else {
                        await wrapper.edit(this.getEmbed(Translator.getString(lang, "errors", "antispam_remaining", [Globals.antiSpamNumberOfTries - this.missedChallenges, Globals.antiSpamMinutesOfBan])));
                    }

                    this.mustAnswer = false;

                } else {
                    await wrapper.edit(this.getEmbed(Translator.getString(lang, "antispam", "success")));
                }

            });
        } else if (this.mustAnswer && !this.isTimeout()) {
            interact.reply({ embeds: [this.getEmbed(Translator.getString(lang, "antispam", "in_progress") + (this.challengeMessageUrl != null ? "\n" + this.challengeMessageUrl : ""))] });
        }

    }

    getEmbed(content) {
        return new MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor({ name: Translator.getString(this.user.lang, "antispam", "title") })
            .setDescription(content);
    }

    updateLengthCheck() {
        this.lengthToCheck = Math.round(100 + (Math.random() * 300));
    }
}

class CommandLog {
    constructor(command, date) {
        this.command = command;
        this.date = date;
    }
}

module.exports = UserChallenge;