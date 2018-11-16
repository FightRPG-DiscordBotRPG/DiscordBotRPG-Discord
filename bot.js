const Discord = require("discord.js");
const Key = require("./conf/botkey.js");
const conf = require("./conf/conf");
const ModuleHandler = require("./src/Modules/ModuleHandler");
const DBL = require("dblapi.js");
const DiscordServers = require("./src/Database/DiscordServers");

var bot = new Discord.Client();

process.on('unhandledRejection', up => {
    throw up;
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



bot.on("ready", async () => {
    console.log("Shard Connected");
    bot.user.setPresence({
        game: {
            name: "On " + await getTotalNumberOfGuilds() + " servers !",
        },
    });
    //console.log(bot.guilds.size, bot.shard.id, bot.shard.count);
    if (conf.env === "prod") {
        const dbl = new DBL(conf.discordbotskey, bot);
        setInterval(async () => {
            console.log("Shard: " + bot.shard.id + " => Sending stats to https://discordbots.org/ ...");
            dbl.postStats(bot.guilds.size, bot.shard.id, bot.shard.count);
            console.log("Data sent");
        }, 1800000);
    }

    DiscordServers.serversStats(bot.guilds);

    console.log("Shard Loaded");

});

let moduleHandler = new ModuleHandler();

// Key Don't open
bot.login(Key);




bot.on('message', async (message) => {
    try {
        await moduleHandler.run(message);
    } catch (err) {
        let msgError = "Oops something goes wrong, report the issue here (https://github.com/FightRPG-DiscordBotRPG/FightRPG-Discord-BugTracker/issues)\n";

        let errorsLines = err.stack.split("\n");
        let nameAndLine = errorsLines[1].split(" ");
        nameAndLine = nameAndLine[nameAndLine.length - 1].split("\\");
        nameAndLine = nameAndLine[nameAndLine.length - 1].split(")")[0];

        msgError += "```js\n" + errorsLines[0] + "\nat " + nameAndLine + "\n```";

        console.log(err);
        message.channel.send(msgError).catch((e) => null);
    }

});

bot.on('guildCreate', async (guild) => {
    bot.user.setPresence({
        game: {
            name: "On " + await getTotalNumberOfGuilds() + " guilds !",
        },
    });
    DiscordServers.newGuild(guild);
});

bot.on('guildDelete', async () => {
    bot.user.setPresence({
        game: {
            name: "On " + await getTotalNumberOfGuilds() + " guilds !",
        },
    });
});