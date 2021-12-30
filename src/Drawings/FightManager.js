'use strict';
const Discord = require("discord.js");
const ProgressBarHealth = require("./ProgressBars/ProgressBarHealth");
const Globals = require("../Globals");
const Translator = require("../Translator/Translator");
const Emojis = require("./Emojis");
const ProgressBar = require("./ProgressBars/ProgressBar");
const Color = require("./Color");
const RoundLogger = require("./Fight/RoundLogger");
const EntityAffectedLogger = require("./Fight/EntityAffectedLogger");
const DamageAndHealLogger = require("./Fight/DamageAndHealLogger");
const TextDrawings = require("./TextDrawings");
const User = require("../Users/User");
const MessageReactionsWrapper = require("../MessageReactionsWrapper");
const InteractContainer = require("../Discord/InteractContainer");

class FightManager {
    constructor() {
        this.fights = {};
        this.healthBar = new ProgressBarHealth();
        this.manaBar = new ProgressBar(Color.Blue);
        this.energyBar = new ProgressBar(Color.Yellow);
        this.separator = "--------------------------------\n";

        this.healthBar.setSize(8);
    }

    // Helper
    swapArrayIndexes(text, fight) {
        fight.text[0] = fight.text[1];
        fight.text[1] = fight.text[2];
        fight.text[2] = text;
        return fight;
    }

    /**
     * 
     * @param {any} data
     * @param {InteractContainer} interact
     * @param {User} user
     */
    async fight(data, interact, user) {
        let lang = data.lang;
        let userid = interact.author.id;
        let leftName = data.summary.rounds[0].roundEntitiesIndex == 0 ? data.summary.rounds[0].attacker.entity.identity.name : data.summary.rounds[0].defenders[0].entity.identity.name;
        let rightName = data.summary.rounds[0].roundEntitiesIndex == 1 ? data.summary.rounds[0].attacker.entity.identity.name : data.summary.rounds[0].defenders[0].entity.identity.name;
        let theFight = {
            text: ["", "", ""],
            summary: data.summary,
            leftName: leftName,
            rightName: rightName,
            summaryIndex: 0,
            team1_number: data.team1_number,
            team2_number: data.team2_number,
            playersMovedTo: data.playersMovedTo,
            skip: false
        };

        if (theFight.summary.type == "pve") {
            if (data.beingAttacked == true) {
                interact.channel.send(Translator.getString(lang, "fight_pve", "ganked_by_monster")).catch((e) => console.log(e));
                theFight.text[2] = Emojis.emojisProd.user.string + " " + Translator.getString(lang, "fight_pve", "user_get_attacked", [leftName, rightName]) + "\n";
            } else {
                theFight.text[2] = Emojis.emojisProd.user.string + " " + Translator.getString(lang, "fight_pve", "user_attacked", [leftName, rightName]) + "\n";
            }
        } else if (theFight.summary.type == "pvp") {
            if (data.team1_number === 1) {
                theFight.text[2] = Emojis.emojisProd.sword.string + " " + Translator.getString(lang, "fight_pve", "user_attacked", [leftName, rightName]) + "\n";
            }
        }



        let displaySkipFight = Emojis.general.next_track_button;

        let emojisList = [
            displaySkipFight
        ];


        const options = InteractContainer.getReplyOptions(this.embedFight(theFight, null, lang, user, true));

        options.components.push(
            new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(displaySkipFight)
                        .setLabel(Translator.getString(user.lang, "general", "skip"))
                        .setStyle("PRIMARY")
                        .setEmoji(displaySkipFight)
                )
        );


        let reactWrapper = new MessageReactionsWrapper();

        await reactWrapper.load(interact, options, {
            reactionsEmojis: emojisList,
            collectorOptions: {
                time: data.summary.rounds.length * 4000,
                max: 1,
            }
        });

        reactWrapper.collector.on('collect',
            /**
             * 
             * @param {Discord.ButtonInteraction} reaction
             */
            async (reaction) => {
                if (reaction.customId === displaySkipFight) {
                    theFight.skip = true;
                    //reaction.reply(Translator.getString(user.lang, "fight", "skipping"));
                }
            });

        await this.discordFight(reactWrapper.message, userid, theFight, lang, user);
    }

    /**
     * 
     * @param {Discord.Message} message
     * @param {any} userid
     * @param {any} fight
     * @param {any} lang
     * @param {User} user
     */
    async discordFight(message, userid, fight, lang, user) {
        let ind = fight.summaryIndex;
        /**
         *  @type {{type: string, rounds: Array<RoundLogger>, drops: Array<{name: string, drop: Array<{equipable: number, other: number}>}>, xp: number, money:number, honor: number, levelUpped: Array<string>, xpGained: Array<Object.<string, number>>, goldGained: Array<Object.<string, number>>, userIds: Array<string>, winner: number}}
         **/
        let summary = fight.summary;



        if (ind < summary.rounds.length) {

            let textDecoration = "";

            if (summary.type == "pve") {
                textDecoration = Emojis.getEntityTypeEmoji(summary.rounds[ind].roundType)
            } else {
                textDecoration = summary.rounds[ind].roundEntitiesIndex == "0" ? Emojis.emojisProd.sword.string : Emojis.emojisProd.shield.string;
            }

            this.swapArrayIndexes(textDecoration + " " + this.getSummaryText(summary.rounds[ind]), fight);


            message.edit({ embeds: [this.embedFight(fight, null, lang, user, true)] })
                .then(() => {
                    fight.summaryIndex++;
                    let waitTime = 4000;
                    if (fight.skip) {
                        fight.summaryIndex = summary.rounds.length;
                        waitTime = 100;
                    }
                    setTimeout(async () => {
                        await this.discordFight(message, userid, fight, lang, user);
                    }, waitTime);
                })
                .catch((e) => {
                    console.log(e);
                });


        } else {
            if (summary.winner == 0) {

                if (summary.bothLost) {
                    fight = this.swapArrayIndexes(Emojis.general.handshake + " " + Translator.getString(lang, "fight_general", "draw") + "\n", fight);
                } else {
                    fight = this.swapArrayIndexes(Emojis.emojisProd.win.string + " " + Translator.getString(lang, "fight_general", "win") + "\n", fight);
                }

                if (fight.team1_number == 1) {

                    if (summary.type == "pve") {
                        if (summary.drops.length > 0) {
                            let drop_string = Emojis.emojisProd.treasure.string + " ";
                            let equipDrop = 0;
                            let otherDrop = 0;
                            let strEquipments = "";
                            let strOthers = "";
                            let allDrops = summary.drops[0].drop;

                            for (let drop in allDrops) {
                                let rname = Translator.getString(lang, "rarities", Globals.getRarityName(drop));
                                if (allDrops[drop].equipable > 0) {
                                    strEquipments += rname + ": " + allDrops[drop].equipable + ", ";
                                    equipDrop += allDrops[drop].equipable;
                                }
                                if (allDrops[drop].other > 0) {
                                    otherDrop += allDrops[drop].other;
                                    strOthers += rname + ": " + allDrops[drop].other + ", ";
                                }
                            }

                            if (strEquipments !== "") {
                                strEquipments = strEquipments.slice(0, -2);
                                drop_string += Translator.getString(lang, "fight_pve", equipDrop > 1 ? "drop_item_equip_plur" : "drop_item_equip", [strEquipments]) + "\n";
                            }
                            if (strOthers !== "") {
                                strOthers = strOthers.slice(0, -2);
                                drop_string += Translator.getString(lang, "fight_pve", otherDrop > 1 ? "drop_item_other_plur" : "drop_item_other", [strOthers]) + "\n";
                            }

                            fight = this.swapArrayIndexes(drop_string, fight);

                        }

                        if (summary.levelUpped.length > 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.levelup.string + " " + Translator.getString(lang, "fight_pve", "level_up", [summary.levelUpped[0].levelGained, summary.levelUpped[0].newLevel]) + "\n", fight);
                        }

                        if (summary.xp == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "money_gain", [summary.money]), fight);
                        } else if (summary.money == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "xp_gain", [summary.xp]), fight);
                        } else if (summary.xp == 0 && summary.money == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "nothing_gain", [summary.xp]), fight);
                        } else {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "both_gain", [summary.xp, summary.money]), fight);
                        }
                    } else if (summary.type == "pvp" && summary.honor != 0) {
                        if (summary.honor > 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.honor.string + " " + Translator.getString(lang, "fight_pvp", "honor_gain", [summary.honor]), fight);
                        } else {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.honor.string + " " + Translator.getString(lang, "fight_pvp", "honor_not_honorable", [-summary.honor]), fight);
                        }
                    }


                } else {

                    if (summary.type == "pve") {
                        if (summary.drops.length > 0) {
                            let highestDrop = 0;
                            let highestDropName = "";

                            for (let drop in summary.drops[0].drop) {
                                let rname = Translator.getString(lang, "rarities", Globals.getRarityName(drop));
                                if (highestDrop < drop) {
                                    highestDrop = drop;
                                    highestDropName = rname;
                                }
                            }
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_drop_item", [highestDropName]) + "\n", fight);
                        }
                        if (summary.levelUpped.length > 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.levelup.string + " " + Translator.getString(lang, "fight_pve", "group_level_up") + "\n", fight);
                        }

                        if (summary.xp == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_money_gain", [summary.money]), fight);
                        } else if (summary.money == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_xp_gain", [summary.xp]), fight);
                        } else if (summary.xp == 0 && summary.money == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_nothing_gain", [summary.xp]), fight);
                        } else {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_both_gain", [summary.xp, summary.money]), fight);
                        }
                    }

                }
            } else {
                fight = this.swapArrayIndexes(Emojis.emojisProd.loose.string + " " + Translator.getString(lang, "fight_general", "loose") + "\n", fight);

                if (summary.type == "pvp" && fight.team1_number == 1 && summary.honor > 0) {
                    fight = this.swapArrayIndexes(Emojis.emojisProd.honor.string + " " + Translator.getString(lang, "fight_pvp", "honor_lose", [summary.honor]), fight);
                }
            }




            // Color settings
            let color;
            if (summary.winner == 0) {
                if (summary.bothLost) {
                    color = [255, 64, 0];
                } else {
                    color = [0, 255, 0];
                }
            } else {
                color = [255, 0, 0];
            }

            await message.edit({ embeds: [this.embedFight(fight, color, lang, user, false)] });

            try {
                if (summary.type == "pve") {
                    // Tag users when fight is done
                    // to notify them 

                    let usersToTag = "";
                    for (let userID of summary.usersIds) {
                        usersToTag += "<@" + userID + "> ";
                    }
                    if (usersToTag != "") {
                        message.channel.send(usersToTag);
                    }

                    if (fight.playersMovedTo != null) {
                        await message.channel.send(Translator.getString(lang, "travel", "travel_to_area", [fight.playersMovedTo]));
                    }
                }
            } catch (ex) {
                console.log(ex);
            }

        }



    }

    /**
     * 
     * @param {RoundLogger} round
     */
    getSummaryText(round) {
        let lang = round.attacker.lang;
        let hitText = "";

        if (!round.success) {
            hitText += ` (${Translator.getString(lang, "fight_general", "missed")}) `;
        } else if (round.defenders[0].battle.isCritical === true) {
            hitText = ` (${Translator.getString(lang, "fight_general", "critical_hit")}) `;
        }

        let str;

        if (round.skillInfo.message.length > 0) {
            str = "**" + round.skillInfo.message + hitText + "**\n";
        } else {
            str = round.attacker.entity.identity.name + " " + Translator.getString(lang, "fight_general", "cant_do_anything") + "\n";
        }

        let attackerStr = "";
        let targetsStr = "";

        for (let item of round.defenders) {
            if (item.entity.identity.uuid === round.attacker.entity.identity.uuid) {
                // If target is attacker then all in one and ignore
                round.attacker.battle.addedStates = [...round.attacker.battle.addedStates, ...item.battle.addedStates];
                round.attacker.battle.removedStates = [...round.attacker.battle.removedStates, ...item.battle.removedStates];
                DamageAndHealLogger.add(round.attacker.battle.skillResults, item.battle.skillResults);
                DamageAndHealLogger.add(round.attacker.battle.statesResults, item.battle.statesResults);
            } else {
                let targetSummary = this.getSummaryEntity(item);
                if (targetSummary.length > 0) {
                    targetsStr += targetSummary;
                }
            }
        }

        attackerStr = this.getSummaryEntity(round.attacker);

        if (attackerStr.length > 0 || targetsStr.length > 0) {
            str += "\n";
        }

        str += attackerStr + targetsStr;



        return str;
    }

    /**
     * 
     * @param {EntityAffectedLogger} entityLogger
     */
    getSummaryEntity(entityLogger, withName = true) {

        let deadEmojiString = entityLogger.entity.actualHP <= 0 ? " " + Emojis.general.skull : "";
        let name = Emojis.getEntityTypeEmoji(entityLogger.entity.identity.type) + " **" + entityLogger.entity.identity.name + "**" + deadEmojiString + "\n";

        let str = withName ? name : "";
        if (entityLogger.battle.removedStates.length > 0) {
            str += `${Emojis.emojisProd.minussign.string} ${Translator.getString(entityLogger.lang, "fight_general", "status_removed", [entityLogger.battle.removedStates.map(e => e.name).join(",")])}\n`;
        }

        if (entityLogger.battle.addedStates.length > 0) {
            str += `${Emojis.emojisProd.plussign.string} ${Translator.getString(entityLogger.lang, "fight_general", "status_added", [entityLogger.battle.addedStates.map(e => e.name).join(",")])}\n`;
        }

        let results = entityLogger.battle.skillResults;

        DamageAndHealLogger.add(results, entityLogger.battle.statesResults);

        str += this.getStatsResultsText(results, entityLogger.lang);

        if (withName) {
            return str.length > name.length ? str : "";
        }

        return str;

    }

    /**
     * 
     * @param {DamageAndHealLogger} results
     * @param {string} lang
     */
    getStatsResultsText(results, lang = "en") {
        let str = "";

        if (results.hpRegen > 0 || results.mpRegen > 0 || results.energyRegen > 0) {
            str += Emojis.emojisProd.levelup.string + " " + Translator.getString(lang, "fight_general", "results_gain") + " ";

            str += results.hpRegen > 0 ? Emojis.general.red_heart + " " + Translator.getString(lang, "fight_general", "results_health_points", [results.hpRegen]) + " " : "";
            str += results.mpRegen > 0 ? Emojis.general.blue_heart + " " + Translator.getString(lang, "fight_general", "results_mana_points", [results.mpRegen]) + " " : "";
            str += results.energyRegen > 0 ? Emojis.general.high_voltage + " " + Translator.getString(lang, "fight_general", "results_energy_points", [results.energyRegen]) + " " : "";

            str += "\n";
        }

        if (results.hpDamage > 0 || results.mpDamage > 0 || results.energyDamage > 0) {
            str += Emojis.emojisProd.leveldown.string + " " + Translator.getString(lang, "fight_general", "results_lost") + " ";

            str += results.hpDamage > 0 ? Emojis.general.red_heart + " " + Translator.getString(lang, "fight_general", "results_health_points", [results.hpDamage]) + " " : "";
            str += results.mpDamage > 0 ? Emojis.general.blue_heart + " " + Translator.getString(lang, "fight_general", "results_mana_points", [results.mpDamage]) + " " : "";
            str += results.energyDamage > 0 ? Emojis.general.high_voltage + " " + Translator.getString(lang, "fight_general", "results_energy_points", [results.energyDamage]) + " " : "";

            str += "\n";
        }

        return str;
    }

    /**
     * 
     * @param {any} fight
     * @param {number[]} color
     * @param {string} lang
     * @param {User} user
     * @param {boolean} ongoing
     */
    embedFight(fight, color, lang, user, ongoing = true) {
        color = color || [128, 128, 128]
        lang = lang || "en"
        let ind = fight.summaryIndex;
        let summary = fight.summary;
        let type = fight.summary.type;
        let monsterTitle = "";

        ind = fight.summaryIndex < summary.rounds.length ? ind : ind - 1;

        let leftEntity, rightEntity;

        if (summary.rounds[ind].roundEntitiesIndex == 0) {
            leftEntity = summary.rounds[ind].attacker.entity;
            rightEntity = summary.rounds[ind].defenders[0] != null ? summary.rounds[ind].defenders[0].entity : summary.rounds[ind].attacker.entity;
        } else {
            rightEntity = summary.rounds[ind].attacker.entity;
            leftEntity = summary.rounds[ind].defenders[0] != null ? summary.rounds[ind].defenders[0].entity : summary.rounds[ind].attacker.entity;
        }

        if (type == "pve") {
            if (rightEntity.identity.monsterType == "elite") {
                monsterTitle = Emojis.emojisProd.elite.string;
            } else if (rightEntity.identity.monsterType == "boss") {
                monsterTitle = Emojis.emojisProd.boss.string;
            } else {
                monsterTitle = this.getMonsterDifficultyEmoji(rightEntity.identity.monsterDifficultyName);
            }
        }


        let battleStatus = "";
        if (ongoing) {
            battleStatus = Translator.getString(lang, "fight_general", "battle_ongoing");
        } else {
            if (summary.winner == 0) {
                battleStatus = Translator.getString(lang, "fight_general", "win");
            } else {
                battleStatus = Translator.getString(lang, "fight_general", "loose");
            }
        }

        let contentText = "";

        if (ongoing) {
            contentText = this.separator + fight.text[2];
        } else {
            contentText = this.separator + fight.text[0] + this.separator + fight.text[1] + this.separator + fight.text[2];
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: Emojis.getString("crossed_swords") + "  " + Translator.getString(lang, "fight_general", "status_of_fight", [battleStatus]) + "  " + Emojis.getString("crossed_swords") })
            .setColor(color)
            .setDescription(contentText)
            //.addField(Translator.getString(lang, "fight_general", "combat_log"), text)
            .addField(this.getEntityTitleDisplay(leftEntity, user),
                this.getBarsDisplay(leftEntity, lang), true)
            .addField(`${monsterTitle} ${this.getEntityTitleDisplay(rightEntity, user)}`,
                this.getBarsDisplay(rightEntity, lang), true)
            .setFooter({ text: (ind + 1) + " / " + ((ind + 1) / fight.summary.rounds.length >= 0.9 ? fight.summary.rounds.length : "?") });

        return embed;
    }

    /**
     * 
     * @param {any} entity
     * @param {User} user
     */
    getEntityTitleDisplay(entity, user) {
        let userIcon = entity.identity.monsterType ? "" : Emojis.emojisProd.user.string + " ";
        return userIcon + entity.identity.name + (user.isOnMobile ? " " : "\n") + Emojis.emojisProd.level.string + " " + entity.level + "  " + Emojis.emojisProd.rebirth.string + " " + entity.rebirthLevel
    }

    getBarsDisplay(entity, lang = "en") {
        return `${TextDrawings.formatHealth(entity.actualHP, entity.maxHP, lang)}\n` +
            `${TextDrawings.formatMana(entity.actualMP, entity.maxMP, lang)}\n` +
            `${TextDrawings.formatEnergy(entity.actualEnergy, entity.maxEnergy, lang)}`;
    }

    getMonsterDifficultyEmoji(name) {
        switch (name) {
            case "Weak":
                return Emojis.getString("rusty_broken_sword");
            case "Young":
                return Emojis.getString("rusty_sword");
            case "Adult":
                return Emojis.getString("sword2");
            case "Alpha":
                return Emojis.getString("gold_sword");
            default:
                return "";
        }
    }



}

module.exports = new FightManager();
