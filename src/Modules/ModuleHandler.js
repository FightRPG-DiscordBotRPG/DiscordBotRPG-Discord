const GModule = require("./GModule");
const Globals = require("../Globals");
const fs = require("fs");
const conn = require("../../conf/mysql");
const Discord = require("discord.js");
const User = require("../Users/User");
const Translator = require("../Translator/Translator");
const version = require("../../conf/version");
const Utils = require("../Utils");
const conf = require("../../conf/conf");

class ModuleHandler extends GModule {
    constructor() {
        super();
        this.isReloadable = false;
        this.prefixes = {};
        this.prefix = "::";
        this.devMode = false;
        this.allCommands = {};
        /**
         * @type {Object<string, GModule>}
         */
        this.modules = {};
        /**
         * @type {Object<string, GModule>}
         */
        this.commandsReact = {};
        this.commands = [
            "prefix",
            "tutorial",
            "play",
            "start",
            "setmobile",
            "load_module",
            "disable_module",
            "enable_module",
            "load_all_modules",
            "disabled_modules",
            "bot_info",
        ]
        this.startLoading("ModuleHandler");
        this.init();
        this.endLoading("ModuleHandler");
    }

    init() {
        this.loadAllModules();
        this.loadPrefixes();
    }

    loadAllModules() {
        fs.readdirSync(__dirname + "/Modules/").forEach(file => {
            this.loadModule(file);
        });
        this.updateAllCommands();
    }

    /**
     * 
     * @param {Discord.Message} message
     */
    async run(message) {
        let msg = "";
        let authorIdentifier = message.author.id;
        let prefix = this.getPrefix(message.channel.guild ? message.channel.guild.id : null);
        // If don't start by prefix 
        if (!message.content.startsWith(prefix)) {
            // If the bot is mention display prefix
            if (!message.author.bot && message.mentions?.members?.first()?.id == message.client.user.id) {
                await this.sendMessage(message,
                    new Discord.MessageEmbed()
                        .setColor([0, 128, 128])
                        .addField(Translator.getString("en", "other", "prefix_title"), prefix)
                )
            }
            return;
        }
        /**
         * @type {any[]}
         **/
        let args = [].concat.apply([], message.content.slice(prefix.length).trim().split('"').map(function (v, i) {
            return i % 2 ? v : v.split(' ')
        })).filter(Boolean);


        let command = args.shift();
        command = command != null ? command.toLowerCase() : "";


        if (!message.author.bot && command != null && this.allCommands[command]) {
            let isAdmin = Globals.admins.indexOf(authorIdentifier) > -1;
            let data;
            this.logCommand(authorIdentifier, command, Date.now());
            await this.connectUser(message);
            let nonDiscordArgs = [];
            for (let i in args) {
                nonDiscordArgs[i] = encodeURIComponent(args[i]);
            }

            if (Globals.connectedUsers[authorIdentifier] == null) {
                return;
            }

            let user = Globals.connectedUsers[authorIdentifier];
            if (user.setMobileMode === "auto") {
                user.setMobile(message.author.presence.clientStatus);
            }

            // exec module corresponding to command
            await this.executeCommand(message, command, nonDiscordArgs, prefix);

            let axios = Globals.connectedUsers[authorIdentifier].getAxios();
            switch (command) {
                case "prefix":
                    msg = this.prefixCommand(message, command, args, "en");
                    break;
                case "tutorial":
                case "play":
                case "start":
                    msg = Translator.getString(user.lang, "help_panel", "tutorial", [Globals.tutorialLink]);
                    break;
                case "setmobile":
                    if (Globals.yesNoByLang[args[0]]) {
                        args[0] = Globals.yesNoByLang[args[0]];
                    }

                    if (args[0] == true) {
                        user.setMobileMode = "manual";
                        user.isOnMobile = true;
                    } else if (args[0] == false) {
                        user.setMobileMode = "manual";
                        user.isOnMobile = false;
                    } else {
                        user.setMobileMode = "auto";
                        user.setMobile(message.author.presence.clientStatus);
                    }

                    msg = Translator.getString(user.lang, "general", "mobile_set", [user.setMobileMode, Translator.getString(user.lang, "general", user.isOnMobile ? "yes" : "no")]);
                    break;
                case "load_module":
                    if (isAdmin) {
                        if (this.loadModule(args[0])) {
                            msg = "Discord: Module " + args[0] + " loaded successfully !\n";
                        } else {
                            msg = "Discord: An error occured when loading the module, module may not exist or can't be reloaded\n";
                        }

                        data = await axios.post("/handler/load_module", {
                            moduleName: args[0],
                        });
                        data = data.data;
                        if (data.error == null) {
                            msg += data.success;
                        } else {
                            msg += data.error;
                        }
                    }
                    break;
                case "disable_module":
                    if (isAdmin) {
                        if (this.disableModule(args[0])) {
                            msg = "Discord: Module " + args[0] + " disabled successfully !\n";
                        } else {
                            msg = "Discord: This module doesn't exist\n";
                        }

                        data = await axios.post("/handler/disable_module", {
                            moduleName: args[0],
                        });
                        data = data.data;
                        if (data.error == null) {
                            msg += data.success;
                        } else {
                            msg += data.error;
                        }
                    }
                    break;
                case "enable_module":
                    if (isAdmin) {
                        if (this.enableModule(args[0])) {
                            msg = "Discord: Module " + args[0] + " enabled successfully !\n";
                        } else {
                            msg = "Discord: This module doesn't exist\n";
                        }

                        data = await axios.post("/handler/enable_module", {
                            moduleName: args[0],
                        });
                        data = data.data;
                        if (data.error == null) {
                            msg += data.success;
                        } else {
                            msg += data.error;
                        }
                    }
                    break;
                case "load_all_modules":
                    /*if (isAdmin) {
                        this.loadAllModules();
                        msg = "Done, check console for errors / warning";
                    }*/
                    break;
                case "disabled_modules":
                     if (isAdmin) {
                         msg = this.getDisabledModules();
                     }
                    break;
                case "bot_info": {

                    let total = await Utils.getTotalNumberOfGuilds(message.client.shard);

                    let totalSeconds = (message.client.uptime / 1000);
                    let hours = Math.floor(totalSeconds / 3600);
                    totalSeconds %= 3600;
                    let minutes = Math.floor(totalSeconds / 60);
                    let seconds = Math.floor(totalSeconds % 60);
                    let uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
                    const os = require('os');

                    let totalMemory = await message.client.shard.broadcastEval("process.memoryUsage().heapUsed");
                    let totalMemoryMB = 0;
                    for (let c of totalMemory) {
                        totalMemoryMB += Math.round(c / 1024 / 1024 * 100) / 100;
                    }

                    data = await axios.get("/helpers/versions");
                    data = data.data;

                    msg = new Discord.MessageEmbed()
                        .setAuthor("FightRPG")
                        .addField("Shard Uptime: ", "[ " + uptime + " ]", true).addField("Shard ID: ", `[ ${message.client.shard.ids} ]`)
                        .addField("Server count: ", "[ " + total + " ]", true).addField("Shards: ", "[ " + message.client.shard.count + " ]", true)
                        .addField("Server Version: ", "[ " + data.server + " ]", true).addField("Bot Version: ", "[ " + version + " ]", true)
                        .addField("Memory Used: ", "[ " + `${totalMemoryMB} MB` + " ]", true).addField("Ping: ", "[ " + Math.round(message.client.ws.ping) + " ms ]", true)
                        .addField("Processor: ", "[ " + os.cpus()[0].model + " [x" + os.cpus().length + "] ]", true)
                    break;
                }

            }

            this.sendMessage(message, msg);
            //console.log("Performing command, took: " + ((Date.now() - dt) / 1000) + " seconds");
        }
    }

    getDisabledModules() {
        let cmds = "";
        for (let m in this.modules) {
            if (!this.modules[m].isActive) {
                cmds += this.modules[m].commands.toString() + "\n";
            }
        }
        return cmds != "" ? cmds : "Tous les modules fonctionnent";
    }

    loadModule(moduleName) {
        if (moduleName != null) {
            moduleName = moduleName.split(".")[0];
            if (fs.existsSync(__dirname + "/Modules/" + moduleName + ".js")) {
                if (this.modules[moduleName] != null) {
                    if (this.modules[moduleName].isReloadable) {
                        for (let cmd of this.modules[moduleName].commands) {
                            if (this.commandsReact[cmd]) delete this.commandsReact[cmd];
                        }
                        delete this.modules[moduleName];
                        delete require.cache[require.resolve("./Modules/" + moduleName + ".js")];
                        return this.loadModule(moduleName);
                    }
                } else {
                    // new module
                    let moduleObject = require("./Modules/" + moduleName);
                    if (moduleObject != null && typeof (moduleObject) == "function") {
                        let mod = new moduleObject();
                        if (mod.isModule) {
                            this.modules[moduleName] = mod;
                            for (let cmd of mod.commands) {
                                this.commandsReact[cmd] = mod;
                            }
                            this.modules[moduleName].allModulesReference = this.modules;
                            this.updateAllCommands();
                            return true;
                        } else {
                            delete require.cache[require.resolve("./Modules/" + moduleName + ".js")];
                        }
                    } else {
                        delete require.cache[require.resolve("./Modules/" + moduleName + ".js")];
                    }
                }
            }

        }

        return false;
    }

    updateAllCommands() {
        this.allCommands = {};
        for (let module of [this, ...Object.values(this.modules)]) {
            for (let command of module.commands) {
                this.allCommands[command] = true;
            }
        }
    }

    prefixCommand(message, command, args, lang) {
        if (message.guild && message.author.id === message.guild.ownerID) {
            if (args[0]) {
                if (args[0].length <= 10) {
                    let oldPrefix = this.getPrefix(message.guild.id);
                    this.prefixChange(message.guild.id, args[0]); // async
                    return new Discord.MessageEmbed()
                        .setColor([0, 128, 128])
                        .setAuthor(Translator.getString(lang, "other", "prefix_changed"))
                        .addField(Translator.getString(lang, "other", "old_prefix"), oldPrefix)
                        .addField(Translator.getString(lang, "other", "new_prefix"), this.getPrefix(message.guild.id));
                } else {
                    return Translator.getString(lang, "errors", "prefix_max_length", [10]);
                }
            } else {
                return Translator.getString(lang, "errors", "prefix_undefined");
            }
        } else {
            return Translator.getString(lang, "errors", "prefix_not_owner_server");
        }
    }

    async prefixChange(idServer, newPrefix) {
        this.prefixes[idServer] = newPrefix;
        await conn.query("UPDATE serversstats SET serverPrefix = ? WHERE idServer = ?", [newPrefix, idServer]);
    }

    loadPrefixes() {
        conn.query("SELECT idServer, serverPrefix FROM serversstats WHERE serverPrefix != '::'").then((prefixes) => {
            for (let result of prefixes) {
                this.prefixes[result.idServer] = result.serverPrefix;
            }
        });
    }

    getPrefix(idServer) {
        if (this.prefixes[idServer]) {
            return this.prefixes[idServer];
        }
        return this.prefix;
    }

    disableModule(moduleName) {
        if (moduleName != null) {
            moduleName = moduleName.split(".")[0];
            if (this.modules[moduleName] != null) {
                this.modules[moduleName].isActive = false;
                return true;
            }
        }
        return false;
    }

    enableModule(moduleName) {
        if (moduleName != null) {
            moduleName = moduleName.split(".")[0];
            if (this.modules[moduleName] != null) {
                this.modules[moduleName].isActive = true;
                return true;
            }
        }
        return false;
    }

    async executeCommand(message, command, args, prefix) {
        let mod = this.commandsReact[command];
        if (mod != null) {
            let user = Globals.connectedUsers[message.author.id];

            if (!user.isAdmin() || conf.env === "dev") {
                await user.challenge.manageIncomingCommand(message, command);
            }
            if (!user.challenge.mustAnswer && !user.challenge.isTimeout()) {
                if (mod.isActive) {
                    try {
                        user.lastCommandUsed = Date.now();
                        await mod.run(message, command, args, prefix);
                    } catch (err) {
                        if (!this.devMode) {
                            if (err.constructor != Discord.DiscordAPIError) {
                                let adminTell = "A module has crashed.\nCommand: " + command + "\nArgs: [" + args.toString() + "]\n" + "User that have crashed the command: " + message.author.username + "#" + message.author.discriminator;
                                message.client.shard.broadcastEval(`let user = this.users.cache.get("241564725870198785");
                            if(user != null) {
                                user.send(\`${adminTell}\`).catch((e) => {null});
                            }`);
                            } else {
                                console.log(err);
                                message.channel.send(err.name).catch((e) => {
                                    message.author.send(err.name).catch((e) => null);
                                });
                            }
                        }
                        throw err;
                    }
                } else {
                    message.channel.send("Due to an error, this module is currently deactivated. The following commands will be disabled: " + mod.commands.toString() + "\nSorry for the inconvenience.").catch((e) => null);
                }
            }


        }
    }

    /**
     * 
     * @param {Discord.Message} message
     */
    async connectUser(message) {
        if (Globals.connectedUsers[message.author.id] == null) {
            let user = new User(message.author.id, message.author.tag, message.author.avatarURL({ dynamic: true }));
            await user.load();
            if (user.token == null) {
                await user.createUser();
                message.author.send(Translator.getString("en", "help_panel", "tutorial", [Globals.tutorialLink])).catch((e) => {
                    message.channel.send(Translator.getString("en", "help_panel", "tutorial", [Globals.tutorialLink])).catch((e) => {
                        console.log(e);
                    });
                });
            }
            if (user.token != null) {
                Globals.connectedUsers[message.author.id] = user;
            }

        }
    }

    /**
    *
    * @param {string} userid
    * @param {string} command
    * @param {string} timestamp
    */
    async logCommand(userid, command, timestamp) {
        if (timestamp == null) {
            timestamp = Date.now();
        }
        await conn.query("INSERT INTO commandslogs VALUES(NULL, ?, ?, ?);", [userid, command == null || command == "" ? "unknown" : command.substring(0, 64), timestamp]);
    }




}

module.exports = ModuleHandler;
