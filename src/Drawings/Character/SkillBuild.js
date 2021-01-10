const User = require("../../Users/User");
const Discord = require("discord.js");
const Translator = require("../../Translator/Translator");
const Emojis = require("../Emojis");

class SkillBuild {

    /**
     * 
     * @param {any} data
     * @param {User} user
     */
    toString(data, user) {
        let lang = user.lang;        
        let color;
        let titleMaximum = "";

        if (data.build.length === 0) {
            color = [0,255,0];
        } else if (data.build.length < data.maximumSkills) {
            color = [255, 165, 0];
        } else {
            color = [255, 0, 0];
            titleMaximum = " - " + Translator.getString(lang, "skills_builds", "maximum_reached");
        }

        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(user.username, user.avatar)
            .setTitle(Translator.getString(lang, "skills_builds", "title_show", [data.build.length, data.maximumSkills]) + titleMaximum);


        if (data.build.length > 0) {
            for (let i in data.build) {
                let skill = data.build[i];
                
                let content = `${Emojis.general.hourglass_not_done} ${Translator.getString(lang, "skills", "required_preparation_points")} => **${skill.timeToCast}**`;
                content += `\n${Translator.getString(lang, "skills_builds", "priority")} => **${(parseInt(i)+1)}**`
                embed = embed.addField(`${skill.name} (${skill.id})`, content);
            }
        } else {
            embed =  embed.setDescription(Translator.getString(lang, "skills_builds", "nothing"));
        }

        return embed;

    }

}


module.exports = new SkillBuild();