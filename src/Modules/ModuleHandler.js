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
const Emojis = require("../Drawings/Emojis");
const InteractContainer = require("../Discord/InteractContainer");

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
            "othertutorial",
            "othersetmobile",
            "adminload_module",
            "admindisable_module",
            "adminenable_module",
            "adminload_all_modules",
            "admindisabled_modules",
            "otherbotinfo",
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
     * @param {InteractContainer} interact
     * @param {Discord.CommandInteraction} interact
     * @param {Discord.Message} interact
     */
    async run(interact) {

        /**
         * @type {Discord.User}
         **/
        let author = interact.author;

        /**
         * @type {Discord.Channel}
         **/
        let channel = interact.channel;

        /**
         * @type {any[]}
         **/
        let args;

        /**
         * @type {string}
         **/
        let command;


        let prefix = this.getPrefix(channel.guild ? channel.guild.id : null);

        if (interact.message) {
            args = [].concat.apply([], interact.message.content.slice(prefix.length).trim().split('"').map(function (v, i) {
                return i % 2 ? v : v.split(' ')
            })).filter(Boolean);

            command = args.shift();
            command = command != null ? command.toLowerCase() : "";
            interact.args = args;
        } else {
            command = interact.command;
            args = interact.args;
        }

        if (Globals.isLoading) {
            await this.sendMessage("The bot is still loading. Please wait. " + Emojis.general.hourglass_not_done)
            return;
        }

        let msg = "";
        let authorIdentifier = author.id;
        // If don't start by prefix 
        if (interact.message && !interact.message.content.startsWith(prefix)) {
            // If the bot is mention display prefix
            if (!author.bot && interact.message.mentions?.members?.first()?.id == interact.client.user.id) {
                await this.sendMessage(interact.message,
                    new Discord.MessageEmbed()
                        .setColor([0, 128, 128])
                        .addField(Translator.getString("en", "other", "prefix_title"), prefix)
                )
            }
            return;
        }


        if (!author.bot && command != null && (this.allCommands[command] || interact.interaction?.isAutocomplete())) {
            let isAdmin = Globals.admins.indexOf(authorIdentifier) > -1;
            let data;
            this.logCommand(authorIdentifier, command, Date.now());
            await this.connectUser(interact);
            let nonDiscordArgs = [];
            for (let i in args) {
                nonDiscordArgs[i] = encodeURIComponent(args[i]);
            }

            if (Globals.connectedUsers[authorIdentifier] == null) {
                return;
            }

            let user = Globals.connectedUsers[authorIdentifier];
            if (user.setMobileMode === "auto") {
                user.setMobile(author.presence?.clientStatus);
            }

            if (!interact.interaction?.isAutocomplete()) {
                await this.executeCommand(interact, command, nonDiscordArgs, prefix);

                let axios = Globals.connectedUsers[authorIdentifier].getAxios();
                switch (command) {
                    case "prefix":
                        msg = this.prefixCommand(interact, args, "en");
                        break;
                    case "othertutorial":
                        await user.tutorial.start(interact, user.lang);
                        msg = Translator.getString(user.lang, "other", "check_dm");
                        break;
                    case "othersetmobile":
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
                            user.setMobile(interact.author.presence?.clientStatus);
                        }

                        msg = Translator.getString(user.lang, "general", "mobile_set", [user.setMobileMode, Translator.getString(user.lang, "general", user.isOnMobile ? "yes" : "no")]);
                        break;
                    case "adminload_module":
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
                    case "admindisable_module":
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
                    case "adminenable_module":
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
                    case "adminload_all_modules":
                        /*if (isAdmin) {
                            this.loadAllModules();
                            msg = "Done, check console for errors / warning";
                        }*/
                        break;
                    case "admindisabled_modules":
                        if (isAdmin) {
                            //msg = this.getDisabledModules();
                            msg = await this.showNotImplementedCommands();
                        }
                        break;
                    case "otherbotinfo": {

                        let total = await Utils.getTotalNumberOfGuilds(interact.client.shard);

                        let totalSeconds = (interact.client.uptime / 1000);
                        let hours = Math.floor(totalSeconds / 3600);
                        totalSeconds %= 3600;
                        let minutes = Math.floor(totalSeconds / 60);
                        let seconds = Math.floor(totalSeconds % 60);
                        let uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
                        const os = require('os');

                        let totalMemory = await interact.client.shard.broadcastEval(() => process.memoryUsage().heapUsed);
                        let totalMemoryMB = 0;
                        for (let c of totalMemory) {
                            totalMemoryMB += Math.round(c / 1024 / 1024 * 100) / 100;
                        }

                        data = await axios.get("/helpers/versions");
                        data = data.data;

                        msg = new Discord.MessageEmbed()
                            .setAuthor({ name: "FightRPG" })
                            .addField("Shard Uptime: ", "[ " + uptime + " ]", true).addField("Shard ID: ", `[ ${interact.client.shard.ids} ]`)
                            .addField("Server count: ", "[ " + total + " ]", true).addField("Shards: ", "[ " + interact.client.shard.count + " ]", true)
                            .addField("Server Version: ", "[ " + data.server + " ]", true).addField("Bot Version: ", "[ " + version + " ]", true)
                            .addField("Memory Used: ", "[ " + `${Math.round(totalMemoryMB)} MB` + " ]", true).addField("Ping: ", "[ " + Math.round(interact.client.ws.ping) + " ms ]", true)
                            .addField("Processor: ", "[ " + os.cpus()[0].model + " [x" + os.cpus().length + "] ]", true)
                        break;
                    }

                }

                this.sendMessage(interact, msg);
                //console.log("Performing command, took: " + ((Date.now() - dt) / 1000) + " seconds");
            } else {
                try {
                    await this.modules["AutocompleteInteractionsModule"].run(interact, command, args, prefix);
                } catch (ex) {
                    console.error("AutocompleteInteractionsModule\n" + ex);
                }
            }


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

    /**
     * 
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {any[]} args
     * @param {string} lang
     */
    prefixCommand(interact, args, lang) {
        if (interact.guild && interact.author.id === interact.guild.ownerId) {
            if (args[0]) {
                if (args[0].length <= 10) {
                    let oldPrefix = this.getPrefix(interact.guild.id);
                    this.prefixChange(interact.guild.id, args[0]); // async
                    return new Discord.MessageEmbed()
                        .setColor([0, 128, 128])
                        .setAuthor({ name: Translator.getString(lang, "other", "prefix_changed") })
                        .addField(Translator.getString(lang, "other", "old_prefix"), oldPrefix)
                        .addField(Translator.getString(lang, "other", "new_prefix"), this.getPrefix(interact.guild.id));
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

    /**
     * 
     * @param {InteractContainer} interact
     * @param {string} command
     * @param {any[]} args
     * @param {string} prefix
     */
    async executeCommand(interact, command, args, prefix) {
        let mod = this.commandsReact[command];
        if (mod != null) {
            let user = Globals.connectedUsers[interact.author.id];

            if (!user.isAdmin() || conf.env === "dev") {
                await user.challenge.manageIncomingCommand(interact, command);
            }
            if (!user.challenge.mustAnswer && !user.challenge.isTimeout()) {
                if (mod.isActive) {
                    try {
                        user.lastCommandUsed = Date.now();
                        await mod.run(interact, command, args, prefix);
                    } catch (err) {
                        if (!this.devMode) {
                            if (err.constructor != Discord.DiscordAPIError) {
                                let adminTell = "A module has crashed.\nCommand: " + command + "\nArgs: [" + args.toString() + "]\n" + "User that have crashed the command: " + interact.author.username + "#" + interact.author.discriminator + "\n";
                                await Utils.sendDMToSpecificUser("241564725870198785", Utils.prepareStackError(err, adminTell));
                            } else {
                                console.log(err);
                                interact.channel.send(err.name).catch((e) => {
                                    interact.author.send(err.name).catch((e) => null);
                                });
                            }
                        }
                        throw err;
                    }
                } else {
                    interact.channel.send("Due to an error, this module is currently deactivated. The following commands will be disabled: " + mod.commands.toString() + "\nSorry for the inconvenience.").catch((e) => null);
                }
            }


        }
    }

    /**
     * 
     * @param {InteractContainer} interact
     */
    async connectUser(interact) {
        if (Globals.connectedUsers[interact.author.id] == null) {

            let user = new User(interact.author.id, interact.author.tag, interact.author.avatarURL({ dynamic: true }));
            await user.load();
            if (user.token == null) {
                await user.createUser();
                await this.sendMessage(interact, Translator.getString("en", "help_panel", "tutorial", [Globals.tutorialLink]));
                await user.tutorial.start(interact, "en");
            }
            if (user.token != null) {
                Globals.connectedUsers[interact.author.id] = user;
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

    /**
     * 
     * @param {GModule} module 
     * @param {any[]} commandsList 
     */
    pushCommandsOfThatModule(module, moduleName, commandsList) {
        for (let command of module.commands) {
            commandsList.push({
                command: command,
                module: moduleName
            });
        }
    }

    showNotImplementedCommands() {
        // List all commands from the modules
        let commandsData = [];
        for (let mod in this.modules) {
            this.pushCommandsOfThatModule(this.modules[mod], mod, commandsData);
        }
        this.pushCommandsOfThatModule(this, "MainModule", commandsData);


        console.log(Globals.admins.map(id => {
            return {
                id: id,
                type: "USER",
                permission: true,
            }
        }));

        /**
         * @type {string[]}
         */
        let implementedCommands = [];

        for (let command of Globals.commands) {
            Utils.recursiveGetCommandName(command, "", implementedCommands);
        }

        // Return missing commands as string separated by comma
        let missing = "";

        missing += "Implemented commands in modules but not in slash commands:\n";
        // Commands from modules not implemented

        let lastModuleName = "";
        for (let commandData of commandsData) {

            if (implementedCommands.indexOf(commandData.command) == -1) {
                if (lastModuleName != commandData.module) {
                    missing += "\n" + commandData.module + ":\n";
                    lastModuleName = commandData.module;
                }
                missing += "- " + commandData.command + "\n";
            }
        }

        missing += "\n\nImplemented commands in slash commands but not in modules:\n";
        // Commands from implemented not implemented in modules
        for (let command of implementedCommands) {
            if (commandsData.findIndex(c => c.command == command) == -1) {
                missing += "- " + command + "\n";
            }
        }

        console.log(missing);

        return missing;

    }


}

module.exports = ModuleHandler;
