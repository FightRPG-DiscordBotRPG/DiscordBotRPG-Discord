const Discord = require("discord.js");
const conf = require("./conf/conf");
const ModuleHandler = require("./src/Modules/ModuleHandler");
const DBL = require("dblapi.js");
const DiscordServers = require("./src/Database/DiscordServers");
const Globals = require("./src/Globals");
const conn = require("./conf/mysql");
const Axios = require("axios").default;

var bot = new Discord.Client();

process.on('unhandledRejection', err => {
    let errorDate = new Date();
    console.log(errorDate.toUTCString());
    console.log(err);
});

console.log("Shard Starting ...");
let timeStart = Date.now();

async function getTotalNumberOfGuilds() {
    let allCounts = await bot.shard.broadcastEval("this.guilds.size");
    let total = 0;
    for (count in allCounts) {
        total += allCounts[count];
    }
    return total;
}

async function startBot() {
    try {
        await bot.login(conf.discordbotkey);
    } catch (error) {
        let errorDate = new Date();
        console.log("Error when connecting Shard. Restarting shard in 30 seconds...");
        console.log(errorDate.toUTCString());
        console.log(err);
        setTimeout(startBot, 30000);
    }
}



bot.on("ready", async () => {
    console.log("Shard Connected");
    bot.user.setPresence({
        game: {
            name: "On " + await getTotalNumberOfGuilds() + " servers!"
        }
    });
    //console.log(bot.guilds.size, bot.shard.id, bot.shard.count);
    if (conf.env === "prod") {
        const dbl = new DBL(conf.topggkey, bot);
        setInterval(async () => {
            console.log("Shard: " + bot.shard.id + " => Sending stats to https://discordbots.org/ ...");
            await dbl.postStats(bot.guilds.size, bot.shard.id, bot.shard.count);
            console.log("Data sent");
        }, 1800000);
    }

    DiscordServers.serversStats(bot.guilds);

    console.log("Shard Loaded");

});

let moduleHandler = new ModuleHandler();

// Key Don't open
startBot();





bot.on('message', async (message) => {
    try {
        await moduleHandler.run(message);
    } catch (err) {
        let msgError = "";
        if (err.constructor == Discord.DiscordAPIError) {
            msgError = "It seems to have an api error, you should check if the bot have all permissions it needs\n";
        } else {
            msgError = "Oops something goes wrong, report the issue here (https://github.com/FightRPG-DiscordBotRPG/FightRPG-Discord-BugTracker/issues)\n";
        }


        let errorsLines = err.stack.split("\n");
        let nameAndLine = errorsLines[1].split(" ");
        nameAndLine = nameAndLine[nameAndLine.length - 1].split("\\");
        nameAndLine = nameAndLine[nameAndLine.length - 1].split(")")[0];

        msgError += "```js\n" + errorsLines[0] + "\nat " + nameAndLine + "\n```";

        let errorDate = new Date();
        console.log(errorDate.toUTCString());
        console.log(err);
        message.channel.send(msgError).catch((e) => message.author.send(msgError).catch((e) => null));
    }

});

bot.on('guildCreate', async (guild) => {
    bot.user.setPresence({
        game: {
            name: "On " + await getTotalNumberOfGuilds() + " servers!",
        },
    });
    DiscordServers.newGuild(guild);
});

bot.on('guildDelete', async () => {
    bot.user.setPresence({
        game: {
            name: "On " + await getTotalNumberOfGuilds() + " servers!",
        },
    });
});

bot.on("userUpdate", async (oldUser, newUser) => {
    if (oldUser.tag != newUser.tag) {
        let axios;
        if (Globals.connectedUsers[newUser.id]) {
            axios = Globals.connectedUsers[newUser.id].getAxios();
        } else {
            let res = await conn.query("SELECT token FROM users WHERE idUser = ?;", [newUser.id]);
            if (res[0]) {
                axios = Axios.create({
                    headers: {
                        'Authorization': "Bearer " + res[0].token
                    }
                })
            }
        }

        if (axios != null) {
            let data = await axios.post("/game/character/update", {
                username: newUser.tag
            });
            if (data.data.error != null) {
                console.log("Axios Existing.. hd5d6589d");
                console.log(data.data);
            }
        } else {
            // console.log("Axios not existing.. c89d6f5c2");
            // console.log(oldUser.tag + " vs " + newUser.tag);
            // console.log(axios);
        }
    }
});