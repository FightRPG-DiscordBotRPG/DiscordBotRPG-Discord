const { Message, MessageEmbed } = require("discord.js");
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
        this.commands = [];
        this.updateLengthCheck();
        this.missedChallenges = 0;
        this.lastMissedChallenge = 0;
        this.user = user;
    }

    isTimeout() {
        return this.lastMissedChallenge + 60000 * Globals.antiSpamMinutesOfBan > Date.now();
    }
    /**
     * 
     * @param {Message} message
     * @param {Array<string>} command
     * @param {Array<string>} args
     */
    async manageIncomingCommand(message, command) {
        this.commands.push({ command: command, time: Date.now() });
        let lang = this.user.lang;

        if (this.commands.length >= this.lengthToCheck && !this.mustAnswer && !this.isTimeout()) {
            this.mustAnswer = true;
            let answers = Utils.getRandomItemsInArray(Object.values(Emojis.emojisProd), 4);           
            this.answer = Utils.getRandomItemsInArray(answers, 1)[0];

            let wrapper = new MessageReactionsWrapper();

            
            await wrapper.load(message, this.getEmbed(Translator.getString(lang, "antispam", "select_emoji", [this.answer.string]), { reactionsEmojis: answers, collectorOptions: { time: 60000 } });
            wrapper.collector.on("collect", (reaction, user) => {
                switch (reaction.emoji.toString()) {
                    case this.answer.string:
                        this.mustAnswer = false;
                        this.commands = [];
                        this.updateLengthCheck();
                        this.missedChallenges = 0;
                        wrapper.collector.stop("end");
                        break;
                }
            });

            wrapper.collector.on("end", async (collected, reason) => {
                console.log(this.mustAnswer);
                if (this.mustAnswer) {
                    this.missedChallenges++;

                    if (this.missedChallenges === Globals.antiSpamNumberOfTries) {
                        await wrapper.edit(this.getEmbed(Translator.getString(lang, "errors", "antispam_end", [Globals.antiSpamMinutesOfBan])));
                        this.missedChallenges = 0;
                        this.lastMissedChallenge = Date.now();
                    } else {
                        Translator.getString()
                        await wrapper.edit(this.getEmbed(Translator.getString(lang, "errors", "antispam_remaining", [Globals.antiSpamNumberOfTries - this.missedChallenges, Globals.antiSpamMinutesOfBan])));
                    }

                    this.mustAnswer = false;

                } else {
                    await wrapper.edit(this.getEmbed(Translator.getString(lang, "antispam", "success")));
                }

            });
        }
        
    }

    getEmbed(content) {
        return new MessageEmbed()
            .setColor([0, 255, 0])
            .setAuthor(Translator.getString(this.user.lang, "antispam", "title"))
            .setDescription(content);
    }

    updateLengthCheck() {
        this.lengthToCheck = Math.round(100 + (Math.random() * 400));
    }
}

module.exports = UserChallenge;