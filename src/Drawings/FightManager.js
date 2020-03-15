'use strict';
const Discord = require("discord.js");
const ProgressBar = require("./ProgressBar");
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


    fightPvE(data, message) {
        let lang = data.lang;
        let userid = message.author.id;
        /*console.log(data);
        process.exit();*/
        let leftName = data.summary.rounds[0].roundEntitiesIndex == 0 ? data.summary.rounds[0].attackerName : data.summary.rounds[0].defenderName;
        let rightName = data.summary.rounds[0].roundEntitiesIndex == 1 ? data.summary.rounds[0].attackerName : data.summary.rounds[0].defenderName;
        let thisPvEFight = {
            text: ["", "", ""],
            summary: data.summary,
            leftName: leftName,
            rightName: rightName,
            summaryIndex: 0,
            team1_number: data.team1_number,
            team2_number: data.team2_number
        };

        if (data.beingAttacked == true) {
            message.channel.send(Translator.getString(lang, "fight_pve", "ganked_by_monster")).catch((e) => console.log(e));
            thisPvEFight.text[2] = "<:user:403148210295537664> " + Translator.getString(lang, "fight_pve", "user_get_attacked", [leftName, rightName]) + "\n\n";
        } else {
            thisPvEFight.text[2] = "<:user:403148210295537664> " + Translator.getString(lang, "fight_pve", "user_attacked", [leftName, rightName]) + "\n\n";
        }
        //thisPvEfight.summary.rounds.length
        //console.log("Fight Initialized");

        message.channel.send(this.embedPvE(thisPvEFight.text[0] + thisPvEFight.text[1] + thisPvEFight.text[2], thisPvEFight, null, lang))
            .then(msg => this.discordFightPvE(msg, userid, thisPvEFight, lang)).catch(e => console.log(e));
    }

    discordFightPvE(message, userid, fight, lang) {
        let ind = fight.summaryIndex;
        let summary = fight.summary;
        if (ind < summary.rounds.length) {
            
            let hitText = "";
            if (summary.rounds[ind].critical === true && summary.rounds[ind].stun === true) {
                hitText = " (" + Translator.getString(lang, "fight_general", "critstun_hit") + "!) ";
            } else if (summary.rounds[ind].critical === true) {
                hitText = " (" + Translator.getString(lang, "fight_general", "critical_hit") + "!) ";
            } else if (summary.rounds[ind].stun === true) {
                hitText = " (" + Translator.getString(lang, "fight_general", "stun_hit") + "!) ";
            }
            
            if (summary.rounds[ind].roundType == "Character") {
                fight = this.swapArrayIndexes("<:user:403148210295537664> " + Translator.getString(lang, "fight_pve", "onfight_user_attack", [summary.rounds[ind].attackerName, summary.rounds[ind].defenderName, summary.rounds[ind].damage]) +
                    hitText +
                    "\n\n", fight);
            } else if (summary.rounds[ind].roundType == "Monster") {
                fight = this.swapArrayIndexes("<:monstre:403149357387350016> " + Translator.getString(lang, "fight_pve", "onfight_monster_attack", [summary.rounds[ind].attackerName, summary.rounds[ind].defenderName, summary.rounds[ind].damage]) +
                    hitText +
                    "\n\n", fight);
            }


            message.edit(this.embedPvE(fight.text[0] + fight.text[1] + fight.text[2], fight, null, lang))
                .then(() => {
                    fight.summaryIndex++;
                    setTimeout(() => {
                        this.discordFightPvE(message, userid, fight, lang);
                    }, 4000);
                })
                .catch((e) => {
                    console.log(e);
                });


        } else {
            if (summary.winner == 0) {
                fight = this.swapArrayIndexes("<:win:403151177153249281> " + Translator.getString(lang, "fight_general", "win") + "\n\n", fight);

                if (fight.team1_number == 1) {
                    if (summary.drops.length > 0) {
                        let drop_string = "<:treasure:403457812535181313>  ";
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

                        if (strEquipments != "") {
                            strEquipments = strEquipments.slice(0, -2);
                            drop_string += Translator.getString(lang, "fight_pve", equipDrop > 1 ? "drop_item_equip_plur" : "drop_item_equip", [strEquipments]) + "\n";
                        }
                        if (strOthers != "") {
                            strOthers = strOthers.slice(0, -2);
                            drop_string += Translator.getString(lang, "fight_pve", otherDrop > 1 ? "drop_item_other_plur" : "drop_item_other", [strOthers]) + "\n";
                        }

                        fight = this.swapArrayIndexes(drop_string + "\n", fight);

                    }

                    if (summary.levelUpped.length > 0) {
                        fight = this.swapArrayIndexes("<:levelup:403456740139728906>  " + Translator.getString(lang, "fight_pve", "level_up", [summary.levelUpped[0].levelGained, summary.levelUpped[0].newLevel]) + "\n", fight);
                    }

                    if (summary.xp === 0) {
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "money_gain", [summary.money]) + "\n", fight);
                    } else if (summary.money === 0) {
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "xp_gain", [summary.xp]) + "\n", fight);
                    } else if (summary.xp === 0 && summary.money === 0) {
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "nothing_gain", [summary.xp]) + "\n", fight);
                    } else {
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "both_gain", [summary.xp, summary.money]) + "\n", fight);
                    }

                } else {
                    // TODO For more people participating
                    //this.swapArrayIndexes("<:treasure:403457812535181313> Vous avez gagné un objet (" + rarityName + ") ! Bravo !\n\n", userid);
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
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "group_drop_item", [highestDropName]) + "\n\n", fight);
                    }
                    if (summary.levelUpped.length > 0) {
                        fight = this.swapArrayIndexes("<:levelup:403456740139728906>  " + Translator.getString(lang, "fight_pve", "group_level_up") + "\n", fight);
                    }

                    if (summary.xp === 0) {
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "group_money_gain", [summary.money]) + "\n", fight);
                    } else if (summary.money === 0) {
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "group_xp_gain", [summary.xp]) + "\n", fight);
                    } else if (summary.xp === 0 && summary.money === 0) {
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "group_nothing_gain", [summary.xp]) + "\n", fight);
                    } else {
                        fight = this.swapArrayIndexes("<:treasure:403457812535181313>  " + Translator.getString(lang, "fight_pve", "group_both_gain", [summary.xp, summary.money]) + "\n", fight);
                    }

                }
            } else {
                fight = this.swapArrayIndexes("<:loose:403153660756099073> " + Translator.getString(lang, "fight_general", "loose") + "\n", fight);
            }


            // Color settings
            let color;
            if (summary.winner == 0) {
                color = [0, 255, 0];
            } else {
                color = [255, 0, 0];
            }

            message.edit(this.embedPvE(fight.text[0] + fight.text[1] + fight.text[2], fight, color, lang)).then(() => {
                // Tag users when fight is done
                // to notify them 
                let usersToTag = "";
                for (let userID of summary.usersIds) {
                    usersToTag += "<@" + userID + "> ";
                }
                if (usersToTag != "") {
                    message.channel.send(usersToTag);
                }
            }).catch((e) => {
                console.log(e)
            });

        }



    }

    deleteFight(userid) { }

    discordFightPvP(message, userid, fight, lang) {
        let ind = fight.summaryIndex;
        let summary = fight.summary;
        if (ind < summary.rounds.length) {
            fight = this.swapArrayIndexes("<:user:403148210295537664> " + Translator.getString(lang, "fight_pvp", "onfight_user_attack", [summary.rounds[ind].attackerName, summary.rounds[ind].defenderName, summary.rounds[ind].damage]) +
                (summary.rounds[ind].critical === true ? " (" + Translator.getString(lang, "fight_general", "critical_hit") + " !) " : "") +
                (summary.rounds[ind].stun === true ? " (" + Translator.getString(lang, "fight_general", "stun_hit") + " !) " : "") +
                "\n\n", fight);

            message.edit(this.embedPvP(fight.text[0] + fight.text[1] + fight.text[2], fight, null, lang))
                .then(() => {
                    fight.summaryIndex++;
                    setTimeout(() => {
                        this.discordFightPvP(message, userid, fight, lang);
                    }, 4000);
                })
                .catch((e) => {
                    console.log(e);
                });


        } else {
            if (summary.winner == 0) {
                fight = this.swapArrayIndexes("<:win:403151177153249281> " + Translator.getString(lang, "fight_general", "win") + "\n\n", fight);
                if (fight.team1_number == 1) {
                    if (summary.honor > 0) {
                        fight = this.swapArrayIndexes("<:honor:403824433837637632> " + Translator.getString(lang, "fight_pvp", "honor_gain", [summary.honor]) + "\n", fight);
                    } else {
                        fight = this.swapArrayIndexes("<:honor:403824433837637632> " + Translator.getString(lang, "fight_pvp", "honor_not_honorable", [-summary.honor]) + "\n", fight);
                    }
                }
            } else {
                fight = this.swapArrayIndexes("<:loose:403153660756099073> " + Translator.getString(lang, "fight_general", "loose") + "\n", fight);
                if (fight.team1_number == 1) {
                    if (summary.honor > 0) {
                        fight = this.swapArrayIndexes("<:honor:403824433837637632> " + Translator.getString(lang, "fight_pvp", "honor_lose", [summary.honor]) + "\n", fight);
                    }
                }
            }


            // Color settings
            let color;
            if (summary.winner == 0) {
                color = [0, 255, 0];
            } else {
                color = [255, 0, 0];
            }

            message.edit(this.embedPvP(fight.text[0] + fight.text[1] + fight.text[2], fight, color, lang)).catch((e) => {
                console.log(e)
            });

        }



    }

    embedPvE(text, fight, color, lang) {
        color = color || [128, 128, 128]
        lang = lang || "en"
        let healthBar = new ProgressBar();
        //console.log(fight);
        let ind = fight.summaryIndex;
        let summary = fight.summary;
        let monsterTitle = "";
        let first, second, firstName, secondName, firstLevel, secondLevel, firstActualHP, secondActualHP, firstMaxHP, secondMaxHP;

        ind = fight.summaryIndex < summary.rounds.length ? ind : ind - 1;

        if (summary.rounds[ind].roundEntitiesIndex == 0) {
            first = healthBar.draw(summary.rounds[ind].attackerHP, summary.rounds[ind].attackerMaxHP);
            firstName = summary.rounds[ind].attackerName;
            firstLevel = summary.rounds[ind].attackerLevel;
            firstActualHP = summary.rounds[ind].attackerHP;
            firstMaxHP = summary.rounds[ind].attackerMaxHP;

            second = healthBar.draw(summary.rounds[ind].defenderHP, summary.rounds[ind].defenderMaxHP);
            secondName = summary.rounds[ind].defenderName;
            secondLevel = summary.rounds[ind].defenderLevel;
            secondActualHP = summary.rounds[ind].defenderHP;
            secondMaxHP = summary.rounds[ind].defenderMaxHP;

        } else {
            first = healthBar.draw(summary.rounds[ind].defenderHP, summary.rounds[ind].defenderMaxHP);
            firstName = summary.rounds[ind].defenderName;
            firstLevel = summary.rounds[ind].defenderLevel;
            firstActualHP = summary.rounds[ind].defenderHP;
            firstMaxHP = summary.rounds[ind].defenderMaxHP;

            second = healthBar.draw(summary.rounds[ind].attackerHP, summary.rounds[ind].attackerMaxHP);
            secondName = summary.rounds[ind].attackerName;
            secondLevel = summary.rounds[ind].attackerLevel;
            secondActualHP = summary.rounds[ind].attackerHP;
            secondMaxHP = summary.rounds[ind].attackerMaxHP;
        }


        if (summary.rounds[ind].monsterType == "elite") {
            monsterTitle = "<:elite:406090076511141888> ";
        } else if (summary.rounds[ind].monsterType == "boss") {
            monsterTitle = "<:boss:456113364687388683> ";
        } else {
            monsterTitle = this.getMonsterDifficultyEmoji(summary.rounds[ind].monsterDifficultyName) + " ";
        }


        let embed = new Discord.RichEmbed()
            .setColor(color)
            .addField(Translator.getString(lang, "fight_general", "combat_log"), text)
            .addField(firstName + " | " + Translator.getString(lang, "general", "lvl") + " : " + firstLevel, Translator.getFormater(lang).format(firstActualHP) + "/" + Translator.getFormater(lang).format(firstMaxHP) + "\n" + first, true)
            .addField(monsterTitle + secondName + " | " + Translator.getString(lang, "general", "lvl") + " : " + secondLevel, Translator.getFormater(lang).format(secondActualHP) + "/" + Translator.getFormater(lang).format(secondMaxHP) + "\n" + second, true);
        return embed;
    }

    embedPvP(text, fight, color, lang) {
        color = color || [128, 128, 128]
        lang = lang || "en"
        let healthBar = new ProgressBar();
        let ind = fight.summaryIndex;
        let summary = fight.summary;
        let first, second, firstName, secondName, firstLevel, secondLevel, firstActualHP, secondActualHP, firstMaxHP, secondMaxHP;

        ind = fight.summaryIndex < summary.rounds.length ? ind : ind - 1;

        if (summary.rounds[ind].roundEntitiesIndex == 0) {
            first = healthBar.draw(summary.rounds[ind].attackerHP, summary.rounds[ind].attackerMaxHP);
            firstName = summary.rounds[ind].attackerName;
            firstLevel = summary.rounds[ind].attackerLevel;
            firstActualHP = summary.rounds[ind].attackerHP;
            firstMaxHP = summary.rounds[ind].attackerMaxHP;

            second = healthBar.draw(summary.rounds[ind].defenderHP, summary.rounds[ind].defenderMaxHP);
            secondName = summary.rounds[ind].defenderName;
            secondLevel = summary.rounds[ind].defenderLevel;
            secondActualHP = summary.rounds[ind].defenderHP;
            secondMaxHP = summary.rounds[ind].defenderMaxHP;

        } else {
            first = healthBar.draw(summary.rounds[ind].defenderHP, summary.rounds[ind].defenderMaxHP);
            firstName = summary.rounds[ind].defenderName;
            firstLevel = summary.rounds[ind].defenderLevel;
            firstActualHP = summary.rounds[ind].defenderHP;
            firstMaxHP = summary.rounds[ind].defenderMaxHP;

            second = healthBar.draw(summary.rounds[ind].attackerHP, summary.rounds[ind].attackerMaxHP);
            secondName = summary.rounds[ind].attackerName;
            secondLevel = summary.rounds[ind].attackerLevel;
            secondActualHP = summary.rounds[ind].attackerHP;
            secondMaxHP = summary.rounds[ind].attackerMaxHP;
        }


        let embed = new Discord.RichEmbed()
            .setColor(color)
            .addField(Translator.getString(lang, "fight_general", "combat_log"), text)
            .addField(firstName + " | " + Translator.getString(lang, "general", "lvl") + " : " + firstLevel, Translator.getFormater(lang).format(firstActualHP) + "/" + Translator.getFormater(lang).format(firstMaxHP) + "\n" + first, true)
            .addField(secondName + " | " + Translator.getString(lang, "general", "lvl") + " : " + secondLevel, Translator.getFormater(lang).format(secondActualHP) + "/" + Translator.getFormater(lang).format(secondMaxHP) + "\n" + second, true);
        return embed;
    }

    fightPvP(data, message) {
        let lang = data.lang;
        let userid = message.author.id;
        let leftName = data.summary.rounds[0].roundEntitiesIndex == 0 ? data.summary.rounds[0].attackerName : data.summary.rounds[0].defenderName;
        let rightName = data.summary.rounds[0].roundEntitiesIndex == 1 ? data.summary.rounds[0].attackerName : data.summary.rounds[0].defenderName;
        let pvpFight = {
            text: ["", "", ""],
            summary: data.summary,
            leftName: leftName,
            rightName: rightName,
            summaryIndex: 0,
            team1_number: data.team1_number,
            team2_number: data.team2_number
        };

        if (data.team1_number == 1) {
            pvpFight.text[2] = "<:sword:403148210295537664> " + Translator.getString(lang, "fight_pve", "user_attacked", [leftName, rightName]) + "\n\n";
        }


        message.channel.send(this.embedPvP(pvpFight.text[0] + pvpFight.text[1] + pvpFight.text[2], pvpFight, null, lang))
            .then(msg => this.discordFightPvP(msg, userid, pvpFight, lang)).catch(e => console.log(e));

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
