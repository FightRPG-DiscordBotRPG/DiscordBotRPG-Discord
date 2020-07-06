'use strict';
const Discord = require("discord.js");
const ProgressBarHealth = require("./ProgressBars/ProgressBarHealth");
const Globals = require("../Globals");
const Translator = require("../Translator/Translator");
const Emojis = require("./Emojis");

class FightManager {
    constructor() {
        this.fights = {};
    }

    // Helper
    swapArrayIndexes(text, fight) {
        fight.text[0] = fight.text[1];
        fight.text[1] = fight.text[2];
        fight.text[2] = text;
        return fight;
    }

    async fight(data, message) {
        let lang = data.lang;
        let userid = message.author.id;
        let leftName = data.summary.rounds[0].roundEntitiesIndex == 0 ? data.summary.rounds[0].attacker.entity.name : data.summary.rounds[0].defenders[0].entity.name;
        let rightName = data.summary.rounds[0].roundEntitiesIndex == 1 ? data.summary.rounds[0].attacker.entity.name : data.summary.rounds[0].defenders[0].entity.name;
        let theFight = {
            text: ["", "", ""],
            summary: data.summary,
            leftName: leftName,
            rightName: rightName,
            summaryIndex: 0,
            team1_number: data.team1_number,
            team2_number: data.team2_number,
            playersMovedTo: data.playersMovedTo
        };

        if (theFight.summary.type == "pve") {
            if (data.beingAttacked == true) {
                message.channel.send(Translator.getString(lang, "fight_pve", "ganked_by_monster")).catch((e) => console.log(e));
                theFight.text[2] = Emojis.emojisProd.user.string + " " + Translator.getString(lang, "fight_pve", "user_get_attacked", [leftName, rightName]) + "\n\n";
            } else {
                theFight.text[2] = Emojis.emojisProd.user.string + " " + Translator.getString(lang, "fight_pve", "user_attacked", [leftName, rightName]) + "\n\n";
            }
        } else if (theFight.summary.type == "pvp") {
            if (data.team1_number === 1) {
                theFight.text[2] = Emojis.emojisProd.sword.string + " " + Translator.getString(lang, "fight_pve", "user_attacked", [leftName, rightName]) + "\n\n";
            }
        }


        let msg = await message.channel.send(this.embedFight(theFight.text[0] + theFight.text[1] + theFight.text[2], theFight, null, lang, true));
        await this.discordFight(msg, userid, theFight, lang);
    }

    async discordFight(message, userid, fight, lang) {
        let ind = fight.summaryIndex;
        let summary = fight.summary;



        if (ind < summary.rounds.length) {
            if (summary.rounds[ind].restrictions.targetEnemy === false && summary.rounds[ind].restrictions.targetAlly === false && summary.rounds[ind].restrictions.targetSelf === false) {
                // Can't do anything due to restrictions
                // Then ignore turn for now
                // Maybe adding some display to summary
                fight.summaryIndex++;
                await this.discordFight(message, userid, fight, lang);

            } else {
                let stunned = this.isStun(summary.rounds[ind]);
                let hitText = "";
                if (summary.rounds[ind].attacker.battle.isCritical == true && stunned) {
                    hitText = " (" + Translator.getString(lang, "fight_general", "critstun_hit") + "!) ";
                } else if (summary.rounds[ind].attacker.battle.isCritical == true) {
                    hitText = " (" + Translator.getString(lang, "fight_general", "critical_hit") + "!) ";
                } else if (stunned) {
                    hitText = " (" + Translator.getString(lang, "fight_general", "stun_hit") + "!) ";
                }

                if (summary.type == "pve") {
                    if (summary.rounds[ind].roundType == "Character") {
                        fight = this.swapArrayIndexes(Emojis.emojisProd.user.string + " " + Translator.getString(lang, "fight_pve", "onfight_user_attack", [summary.rounds[ind].attacker.entity.name, summary.rounds[ind].defenders[0].entity.name, summary.rounds[ind].defenders[0].battle.hpDamage]) +
                            hitText +
                            "\n\n", fight);
                    } else if (summary.rounds[ind].roundType == "Monster") {
                        fight = this.swapArrayIndexes(Emojis.emojisProd.monster.string + " " + Translator.getString(lang, "fight_pve", "onfight_monster_attack", [summary.rounds[ind].attacker.entity.name, summary.rounds[ind].defenders[0].entity.name, summary.rounds[ind].defenders[0].battle.hpDamage]) +
                            hitText +
                            "\n\n", fight);
                    }
                } else {
                    fight = this.swapArrayIndexes((summary.rounds[ind].roundEntitiesIndex == "0" ? Emojis.emojisProd.sword.string : Emojis.emojisProd.shield.string) + " " + Translator.getString(lang, "fight_pvp", "onfight_user_attack", [summary.rounds[ind].attacker.entity.name, summary.rounds[ind].defenders[0].entity.name, summary.rounds[ind].defenders[0].battle.hpDamage]) +
                        hitText +
                        "\n\n", fight);
                }



                message.edit(this.embedFight(fight.text[0] + fight.text[1] + fight.text[2], fight, null, lang, true))
                    .then(() => {
                        fight.summaryIndex++;
                        setTimeout(async () => {
                            await this.discordFight(message, userid, fight, lang);
                        }, 4000);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }





        } else {
            if (summary.winner == 0) {
                fight = this.swapArrayIndexes(Emojis.emojisProd.win.string + " " + Translator.getString(lang, "fight_general", "win") + "\n\n", fight);

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

                            fight = this.swapArrayIndexes(drop_string + "\n", fight);

                        }

                        if (summary.levelUpped.length > 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.levelup.string + " " + Translator.getString(lang, "fight_pve", "level_up", [summary.levelUpped[0].levelGained, summary.levelUpped[0].newLevel]) + "\n", fight);
                        }

                        if (summary.xp == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "money_gain", [summary.money]) + "\n", fight);
                        } else if (summary.money == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "xp_gain", [summary.xp]) + "\n", fight);
                        } else if (summary.xp == 0 && summary.money == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "nothing_gain", [summary.xp]) + "\n", fight);
                        } else {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "both_gain", [summary.xp, summary.money]) + "\n", fight);
                        }
                    } else if (summary.type == "pvp") {
                        if (summary.honor > 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.honor.string + " " + Translator.getString(lang, "fight_pvp", "honor_gain", [summary.honor]) + "\n", fight);
                        } else {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.honor.string + " " + Translator.getString(lang, "fight_pvp", "honor_not_honorable", [-summary.honor]) + "\n", fight);
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
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_drop_item", [highestDropName]) + "\n\n", fight);
                        }
                        if (summary.levelUpped.length > 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.levelup.string + " " + Translator.getString(lang, "fight_pve", "group_level_up") + "\n", fight);
                        }

                        if (summary.xp == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_money_gain", [summary.money]) + "\n", fight);
                        } else if (summary.money == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_xp_gain", [summary.xp]) + "\n", fight);
                        } else if (summary.xp == 0 && summary.money == 0) {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_nothing_gain", [summary.xp]) + "\n", fight);
                        } else {
                            fight = this.swapArrayIndexes(Emojis.emojisProd.treasure.string + " " + Translator.getString(lang, "fight_pve", "group_both_gain", [summary.xp, summary.money]) + "\n", fight);
                        }
                    }

                }
            } else {
                fight = this.swapArrayIndexes(Emojis.emojisProd.loose.string + " " + Translator.getString(lang, "fight_general", "loose") + "\n", fight);

                if (summary.type == "pvp" && fight.team1_number == 1 && summary.honor > 0) {
                    fight = this.swapArrayIndexes(Emojis.emojisProd.honor.string + " " + Translator.getString(lang, "fight_pvp", "honor_lose", [summary.honor]) + "\n", fight);
                }
            }




            // Color settings
            let color;
            if (summary.winner == 0) {
                color = [0, 255, 0];
            } else {
                color = [255, 0, 0];
            }

            await message.edit(this.embedFight(fight.text[0] + fight.text[1] + fight.text[2], fight, color, lang, false));

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


    isStun(round) {
        for (let item of round.defenders) {
            for (let state of item.battle.addedStates) {
                if (state?.id === 1) {
                    return true;
                }
            }
        }
    }

    embedFight(text, fight, color, lang, ongoing = true) {
        color = color || [128, 128, 128]
        lang = lang || "en"
        let healthBar = new ProgressBarHealth();

        let ind = fight.summaryIndex;
        let summary = fight.summary;
        let type = fight.summary.type;
        let monsterTitle = "";
        let first, second, firstName, secondName, firstLevel, secondLevel, firstActualHP, secondActualHP, firstMaxHP, secondMaxHP;

        ind = fight.summaryIndex < summary.rounds.length ? ind : ind - 1;

        if (summary.rounds[ind].roundEntitiesIndex == 0) {
            first = healthBar.draw(summary.rounds[ind].attacker.entity.actualHP, summary.rounds[ind].attacker.entity.maxHP);
            firstName = summary.rounds[ind].attacker.entity.name;
            firstLevel = summary.rounds[ind].attacker.entity.level;
            firstActualHP = summary.rounds[ind].attacker.entity.actualHP;
            firstMaxHP = summary.rounds[ind].attacker.entity.maxHP;

            second = healthBar.draw(summary.rounds[ind].defenders[0].entity.actualHP, summary.rounds[ind].defenders[0].entity.maxHP);
            secondName = summary.rounds[ind].defenders[0].entity.name;
            secondLevel = summary.rounds[ind].defenders[0].entity.level;
            secondActualHP = summary.rounds[ind].defenders[0].entity.actualHP;
            secondMaxHP = summary.rounds[ind].defenders[0].entity.maxHP;

        } else {
            first = healthBar.draw(summary.rounds[ind].defenders[0].entity.actualHP, summary.rounds[ind].defenders[0].entity.maxHP);
            firstName = summary.rounds[ind].defenders[0].entity.name;
            firstLevel = summary.rounds[ind].defenders[0].entity.level;
            firstActualHP = summary.rounds[ind].defenders[0].entity.actualHP;
            firstMaxHP = summary.rounds[ind].defenders[0].entity.maxHP

            second = healthBar.draw(summary.rounds[ind].attacker.entity.actualHP, summary.rounds[ind].attacker.entity.maxHP);
            secondName = summary.rounds[ind].attacker.entity.name;
            secondLevel = summary.rounds[ind].attacker.entity.level;
            secondActualHP = summary.rounds[ind].attacker.entity.actualHP;
            secondMaxHP = summary.rounds[ind].attacker.entity.maxHP;
        }

        if (type == "pve") {
            if (summary.rounds[ind].monsterType == "elite") {
                monsterTitle = "<:elite:406090076511141888> ";
            } else if (summary.rounds[ind].monsterType == "boss") {
                monsterTitle = "<:boss:456113364687388683> ";
            } else {
                monsterTitle = this.getMonsterDifficultyEmoji(summary.rounds[ind].monsterDifficultyName) + " ";
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
        let embed = new Discord.MessageEmbed()
            .setAuthor(Emojis.getString("crossed_swords") + "  " + Translator.getString(lang, "fight_general", "status_of_fight", [battleStatus]) + "  " + Emojis.getString("crossed_swords"))
            .setColor(color)
            .addField(Translator.getString(lang, "fight_general", "combat_log"), text)
            .addField(firstName + " | " + Translator.getString(lang, "general", "lvl") + " : " + firstLevel, Translator.getFormater(lang).format(firstActualHP) + "/" + Translator.getFormater(lang).format(firstMaxHP) + "\n" + first, true)
            .addField(monsterTitle + secondName + " | " + Translator.getString(lang, "general", "lvl") + " : " + secondLevel, Translator.getFormater(lang).format(secondActualHP) + "/" + Translator.getFormater(lang).format(secondMaxHP) + "\n" + second, true);
        return embed;
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
