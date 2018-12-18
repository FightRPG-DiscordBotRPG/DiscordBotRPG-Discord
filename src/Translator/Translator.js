const fs = require("fs");
const util = require("util");
const conn = require("../../conf/mysql");

class Translator {

    /**
     * 
     * @param {String} lang 
     * @param {String} type 
     * @param {String} name 
     * @param {Array} args 
     * @returns {String} Translated String / Or null
     */
    static getString(lang, type, name, args, returnNull = false) {
        if (!this.translations[lang]) {
            lang = "en";
        }

        if (this.translations[lang][type] && this.translations[lang][type][name]) {

            args = Array.isArray(args) ? args : [];
            args.unshift(this.translations[lang][type][name]);
            console.log(util.formatWithOptions.toString());
            return util.format.apply(util, args);
        }
        if (lang != "en") {
            return this.getString("en", type, name, args, returnNull);
        }

        return returnNull ? null : lang + " | " + type + " | " + name;
    }

    /**
     * 
     * @param {String} lang 
     * @returns {boolean}
     */
    static isLangExist(lang) {
        return this.translations[lang] ? true : false
    }

    /**
     * 
     * @param {string} lang 
     * @returns {string} List of available language Localized
     */
    static getAvailableLanguages(lang) {
        let data = {};
        for (let i in this.translations) {
            data[i] = this.getString(lang, "languages", i);
            //+= this.getString(lang, "languages", i) + " (" + i + ")" + (count == this.nbOfTranslations ? "" : ", ");
        }
        return data;
    }

    static load(callback) {
        var self = this;
        fs.readdir(__dirname + "/locale", (err, filenames) => {
            if (!err) {
                for (let i of filenames) {
                    self.translations[i.split(".")[0]] = JSON.parse(fs.readFileSync(__dirname + "/locale/" + i));
                    self.nbOfTranslations++;
                }
                callback ? callback() : null;
            }
        })
    }

    static loadSync() {
        var filenames = fs.readdirSync(__dirname + "/locale");
        for (let i of filenames) {
            this.translations[i.split(".")[0]] = JSON.parse(fs.readFileSync(__dirname + "/locale/" + i));
            this.nbOfTranslations++;
        }
    }
}

Translator.translations = {};
Translator.nbOfTranslations = 0;
Translator.loadSync();

/*
var sizeof = require('object-sizeof');
console.log(sizeof(Translator.translations));*/

module.exports = Translator;