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
const InteractContainer = require("./src/Discord/InteractContainer");

var bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    makeCache: Discord.Options.cacheWithLimits(),
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
        console.time("Bot login");
        await bot.login(conf.discordbotkey);
        console.timeEnd("Bot login");

        console.time("Load Translator");
        await Translator.loadTranslator();
        console.timeEnd("Load Translator");

        console.time("Load Help Panel");
        await Globals.loadHelpPanel();
        console.timeEnd("Load Help Panel");

        console.time("Load Appearances");
        await Globals.loadAllAppearances();
        console.timeEnd("Load Appearances");

        setTimeoutToRemoveInactiveUsers();

        Globals.isLoading = false;
    } catch (error) {
        let errorDate = new Date();
        console.log("Error when connecting Shard. Restarting shard in 30 seconds...");
        console.log(errorDate.toUTCString());
        console.log(error);
        //setTimeout(startBot, 30000);
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
    console.log(`Avg time per requests: ${Math.round((Date.now() - t) / totalRequests.length)}ms; Number of requests per minute: ${1000 / Math.round((Date.now() - t) / totalRequests.length)}`);
    console.log(`Memory after requests: ${await getMemory()} MB`);
    console.timeEnd("Requesting");
}

async function getMemory() {
    let totalMemory = await bot.shard.broadcastEval(() => process.memoryUsage().heapUsed);
    let totalMemoryMB = 0;
    for (let c of totalMemory) {
        totalMemoryMB += Math.round(c / 1048576);
    }
    return totalMemoryMB;
}


/**
 * 
 * @param {InteractContainer} interact
 */
async function tryHandleMessage(interact) {
    try {
        await Globals.moduleHandler.run(interact);
    } catch (err) {
        let msgError = "";
        if (err.constructor == Discord.DiscordAPIError) {
            msgError = "It seems to have an api error, you should check if the bot have all permissions it needs\n";
        } else {
            msgError = "Oops something went wrong, report the issue here (https://github.com/FightRPG-DiscordBotRPG/FightRPG-Discord-BugTracker/issues)\n";
        }
        msgError = Utils.prepareStackError(err, msgError);
        interact.channel.send(msgError).catch((e) => interact.author.send(msgError).catch((e) => null));
    }
}

/**
 * 
 * @param {import("discord.js").CommandInteractionOption[]} interactions
 * @param {InteractContainer} interact
 */
async function recursiveUpdateData(interactions, interact) {
    for (let i of interactions) {
        if (i.value !== undefined) {
            const val = i.value.toString();

            if (val.startsWith("<@!")) {
                const id = val.slice(3, val.length - 1);
                interact.mentions.set(id, await bot.users.fetch(id))
            } else {
                interact.args.push(i.value);
            }
        } else {
            if (i.type.toString().includes("SUB_COMMAND")) {
                interact.command += i.name;
            }

            if (i.options) {
                await recursiveUpdateData(i.options, interact);
            }
        }
    }
}


bot.on("ready", async () => {
    console.log("Shard Connected");

    bot.user.setPresence({
        activities: [{
            name: "On " + await Utils.getTotalNumberOfGuilds(bot.shard) + " servers!"
        }]
    });


    //const cmds = await bot.application?.commands.set([
    //    {
    //        name: "test",
    //        description: "test",
    //        options: [{
    //            name: "input",
    //            type: "",
    //            description: "ça sert à rien",
    //            require: true
    //        }],
    //    }
    //]);

    //console.log(`${bot.guilds.cache.size}\n${bot.shard.ids}\n${bot.shard.count}`);
    if (conf.env === "prod") {
        const api = new Topgg.Api(conf.topggkey);
        setInterval(async () => {
            console.log("Shards: " + bot.shard.ids);
            console.log("Shard: " + bot.shard.ids[0] + " => Sending stats to https://top.gg/ ...");
            await api.postStats({ serverCount: bot.guilds.cache.size, shardId: bot.shard.ids[0], shardCount: bot.shard.count });
            console.log("Data sent");
        }, 1800000);
    }

    DiscordServers.serversStats(bot.guilds);

    console.log("Shard Loaded");

});

Globals.moduleHandler = new ModuleHandler();

// Key Don't open
startBot();


bot.on("interactionCreate",
    /**
     * 
     * @param {Discord.Interaction} interaction 
     */
    async (interaction) => {

        const interact = new InteractContainer();
        interact.author = interaction.user;
        interact.channel = interaction.channel;
        interact.interaction = interaction;
        interact.guild = interaction.guild;
        interact.command = interaction.commandName;
        interact.client = bot;

        let shouldHandleHere = false;

        if (interaction.isCommand() || interaction.isAutocomplete()) {
            await recursiveUpdateData(interaction.options.data, interact, bot);
            shouldHandleHere = true;
        } else if (interaction.isContextMenu()) {
            interact.mentions.set(interaction.targetId, await bot.users.fetch(interaction.targetId), bot);
            shouldHandleHere = true;
        }

        if (shouldHandleHere) {
            await tryHandleMessage(interact);
        }


    });



bot.on("messageCreate", async (message) => {
    const interact = new InteractContainer();
    interact.author = message.author;
    interact.channel = message.channel;
    interact.message = message;
    interact.guild = message.guild;
    interact.client = bot;
    interact.mentions = message.mentions.users;
    await tryHandleMessage(interact);
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
