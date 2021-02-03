const Discord = require("discord.js");
const conf = require("./conf/conf");
const ModuleHandler = require("./src/Modules/ModuleHandler");
const Topgg = require("@top-gg/sdk");
const DiscordServers = require("./src/Database/DiscordServers");
const Globals = require("./src/Globals");
const conn = require("./conf/mysql");
const Axios = require("axios").default;
const Utils = require("./src/Utils");
const Translator = require("./src/Translator/Translator");

var bot = new Discord.Client({
    messageCacheLifetime: 3600,
    messageSweepInterval: 3600,
});

process.on('unhandledRejection', err => {
    let errorDate = new Date();
    console.log(errorDate.toUTCString());
    console.log(err);
});

console.log("Shard Starting ...");
let timeStart = Date.now();

async function startBot() {
    try {
        await Translator.loadTranslator();
        await Globals.loadHelpPanel();
        await bot.login(conf.discordbotkey);
        setTimeoutToRemoveInactiveUsers();
    } catch (error) {
        let errorDate = new Date();
        console.log("Error when connecting Shard. Restarting shard in 30 seconds...");
        console.log(errorDate.toUTCString());
        console.log(error);
        setTimeout(startBot, 30000);
    }
}

async function removedInactiveUsers() {
    let now = Date.now();
    let inactiveUsers = 0;
    for (let idUser in Globals.connectedUsers) {
        let user = Globals.connectedUsers[idUser];
        let diff = now - user.lastCommandUsed;

        // 30 minutes inactive before removing some data from globals
        if (diff / 60000 > Globals.inactiveTimeBeforeDisconnect) {
            delete Globals.connectedUsers[user.id];
            inactiveUsers++;
        }
    }

    try {
        console.log(`Removed: ${inactiveUsers} inactive users. Memory consumption: ${await getMemory()} MB`);
    } catch (ex) { console.error(ex); }
    //createDummyUsers();
    setTimeoutToRemoveInactiveUsers();
    
}

function setTimeoutToRemoveInactiveUsers() {
    setTimeout(removedInactiveUsers, Globals.inactiveTimeBeforeDisconnect * 60000);
}

async function createDummyUsers() {
    let nbUsersToCreate = Math.round(Math.random() * 10000);
    console.log(`Creating ${nbUsersToCreate} fake users...\nMemory before: ${await getMemory()} MB`);
    let totalRequests = [];
    const User = require("./src/Users/User");

    const t = Date.now();

    for (let i = 0; i < nbUsersToCreate; i++) {
        let zerofilled = ('0000000' + Math.floor(Math.random() * 10000000)).slice(-7);
        let u = new User(zerofilled, "Test User#1111", "");
        u.token = ""; //When testing use your token don't forget to remove it
        u.initAxios();
        totalRequests.push(u.getAxios().get("/game/character/info"));
        Globals.connectedUsers[zerofilled] = u;
    }
    console.log(`Memory after creation: ${await getMemory()} MB`);

    console.time("Requesting");
    await Promise.all(totalRequests);
    console.log(`Avg time per requests: ${Math.round((Date.now() - t) / totalRequests.length)}ms; Number of requests per minute: ${1000/Math.round((Date.now() - t) / totalRequests.length)}`);
    console.log(`Memory after requests: ${await getMemory()} MB`);
    console.timeEnd("Requesting");
}

async function getMemory() {
    let totalMemory = await bot.shard.broadcastEval("process.memoryUsage().heapUsed");
    let totalMemoryMB = 0;
    for (let c of totalMemory) {
        totalMemoryMB += Math.round(c / 1048576);
    }
    return totalMemoryMB;
}


bot.on("ready", async () => {
    console.log("Shard Connected");

    bot.user.setPresence({
        activity: {
            name: "On " + await Utils.getTotalNumberOfGuilds(bot.shard) + " servers!"
        }
    });
    //console.log(`${bot.guilds.cache.size}\n${bot.shard.ids}\n${bot.shard.count}`);
    if (conf.env === "prod") {
        const api = new Topgg.Api(conf.topggkey);
        setInterval(async () => {
            console.log("Shards: " + bot.shard.ids);
            console.log("Shard: " + bot.shard.ids[0] + " => Sending stats to https://top.gg/ ...");
            await api.postStats({ serverCount: bot.guilds.cache.size, shardId: bot.shard.ids[0], shardCount:bot.shard.count });
            console.log("Data sent");
        }, 1800000);
    }

    DiscordServers.serversStats(bot.guilds);

    console.log("Shard Loaded");

});

Globals.moduleHandler = new ModuleHandler();

// Key Don't open
startBot();





bot.on('message', async (message) => {
    try {
        await Globals.moduleHandler.run(message);
    } catch (err) {
        let msgError = "";
        if (err.constructor == Discord.DiscordAPIError) {
            msgError = "It seems to have an api error, you should check if the bot have all permissions it needs\n";
        } else {
            msgError = "Oops something went wrong, report the issue here (https://github.com/FightRPG-DiscordBotRPG/FightRPG-Discord-BugTracker/issues)\n";
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
        activity: {
            name: "On " + await Utils.getTotalNumberOfGuilds(bot.shard) + " servers!",
        },
    });
    DiscordServers.newGuild(guild);
});

bot.on('guildDelete', async (guild) => {
    bot.user.setPresence({
        activity: {
            name: "On " + await Utils.getTotalNumberOfGuilds(bot.shard) + " servers!",
        },
    });
});

bot.on("userUpdate", async (oldUser, newUser) => {
    if (oldUser.tag != newUser.tag) {
        let axios;
        if (Globals.connectedUsers[newUser.id]) {
            axios = Globals.connectedUsers[newUser.id].getAxios();
            Globals.connectedUsers[newUser.id].avatar = newUser.avatar;
            Globals.connectedUsers[newUser.id].username = newUser.username;
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
                username: newUser.tag,
                avatar: oldUser.avatar != newUser.avatar ? newUser.avatar : null,
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
