const discord = require("discord.js");
const Globals = require("./Globals");
const GenericMultipleEmbedList = require("./Drawings/GenericMultipleEmbedList");
const Emojis = require("./Drawings/Emojis");
const Translator = require("./Translator/Translator");
const User = require("./Users/User");
const Canvas = require("canvas");
const { default: axios } = require("axios");

class Utils {
    static emptyEmbedCharacter = "\u200b";
    static defaultSeparator = "--------------------------------------";

    static axiosToUse = axios.create({
        baseURL: "http://localhost:48921"
    })

    /**
     * 
     * @param {discord.ShardClientUtil} shard
     */
    static async getTotalNumberOfGuilds(shard) {
        try {
            let allCounts = await shard.broadcastEval("this.guilds.cache.size");
            let total = 0;
            for (let count in allCounts) {
                total += allCounts[count];
            }

            return total;
        } catch {
            return 1;
        }

    }

    /**
     * 
     * @param {discord.MessageEmbed} embed
     */
    static addEmptyFieldToEmbed(embed) {
        return embed.addField("\u200b", "\u200b", true);
    }

    static clean(text) {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }

    static add(obj1, obj2) {
        let newObj = { ...obj1 };
        for (const key of Object.keys(obj2)) {
            if (key in newObj) {
                newObj[key] += obj2[key];
            }
        }

        return newObj;
    }

    /**
    * 
    * @param {Array} pool
    * @param {number} k
    * @param {boolean} destructive
    * @returns {Array}
    */
    static sample(pool, k, destructive) {
        var n = pool.length;
        if (k < 0 || k > n)
            throw new RangeError("Sample larger than population or is negative");

        if (destructive || n <= (k <= 5 ? 21 : 21 + Math.pow(4, Math.ceil(Math.log(k * 3, 4))))) {

            if (!destructive)
                pool = Array.prototype.slice.call(pool);
            for (let i = 0; i < k; i++) { // invariant: non-selected at [i,n)
                var j = i + Math.random() * (n - i) | 0;
                var x = pool[i];
                pool[i] = pool[j];
                pool[j] = x;
            }
            pool.length = k; // truncate
            return pool;
        } else {
            let selected = new Set();
            let ret = [];
            while (selected.add(Math.random() * n | 0).size < k) { }
            selected.forEach((i, j) => ret.push(pool[i]));
            return ret;
        }
    }

    /**
     * 
     * @param {Array} arr
     * @param {number} n
     */
    static getRandomItemsInArray(arr, n) {
        return this.sample(arr, Utils.getProtectedNValue(arr, n), false);
    }


    /**
    *
    * @param {Array} arr
    * @param {number} n
    */
    static getProtectedNValue(arr, n) {
        if (n > arr.length) {
            return arr.length;
        } else if (n < 0) {
            return 1;
        }
        return n;
    }

    static getHelpPanel(lang = "en", page = 1) {
        let maxPage = 8;
        page = page && page > 0 && page <= maxPage ? page : 1;
        // Fix lang is null on some users, maybe when first loaded
        // So now if lang isn't valid or loaded, we use the default english one
        lang = Globals.helpPanel[lang] == null ? "en" : lang;
        return {
            commands: Globals.helpPanel[lang][page],
            page: page,
            maxPage: maxPage,
        };
    }

    static addToEmbedRequiredItems(embed, requiredItems, lang = "en") {
        if (requiredItems != null && requiredItems.length > 0) {
            embed = embed.addField(Emojis.general.package + " " + Translator.getString(lang, "craft", "needed_items"), Translator.getString(lang, "craft", "header_required"));
            let neededItems = new GenericMultipleEmbedList();
            neededItems.load({ collection: requiredItems, displayIfEmpty: "", listType: 0 }, lang, (index, itemNeeded) => {
                let emojiMissing = itemNeeded.missing == 0 ? Emojis.general.g_vmark : (itemNeeded.missing < itemNeeded.number ? Emojis.emojisProd.tild.string : Emojis.general.g_xmark);
                return `${emojiMissing} **${itemNeeded.name}** - ${Emojis.getItemTypeEmoji(itemNeeded.type_shorthand)} ${itemNeeded.type} - ${Emojis.getResourceSubtype(itemNeeded.subType_shorthand, itemNeeded.rarity_shorthand)} ${itemNeeded.subType} - ${Emojis.getRarityEmoji(itemNeeded.rarity_shorthand)} ${itemNeeded.rarity} - x${Translator.getFormater(lang).format(itemNeeded.number)}`;
            });
            return neededItems.getEmbed(embed);
        } else {
            embed = embed.addField(Emojis.general.package + " " + Translator.getString(lang, "craft", "needed_items"), Translator.getString(lang, "general", "none"));
            return embed;
        }

    }

    /**
     * 
     * @param {Date} date
     */
    static dateToLocalizedString(date, lang = "en") {
        return date.toLocaleString(lang.length > 2 ? lang : lang + "-" + lang.toUpperCase()) + " UTC";
    }

    /**
    *
    * @param {{bonus_identifier: string, name:string, percentage:number}[]} bonuses
    * @param {User} user
    */
    static bonusesToStr(bonuses, user) {
        let str = "";
        let empty = true;

        for (let bonus of bonuses) {
            if (bonus.percentage > 0) {
                str += Emojis.getAreaBonusEmoji(bonus.bonus_identifier) + " " + bonus.name + " : " + bonus.percentage + "%" + "\n";
                empty = false;
            }
        }

        if (empty) {
            str += Translator.getString(user.lang, "bonuses", "no_bonuses");
        }
        return str;
    }

    /**
     * 
     * @param {any} bonuses
     * @param {User} user
     * @param {discord.MessageEmbed} embed
     */
    static addBonusesToEmbed(bonuses, user, embed) {
        return embed.addField(Translator.getString(user.lang, "bonuses", "bonuses"), this.bonusesToStr(bonuses, user));
    }

    static randRangeInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * 
     * @param {Canvas.Image} image
     * @param {string} color
     * @param {number} opacity
     * @returns {Canvas.Canvas}
     */
    static canvasTintImage(image, color, opacity = 0.5) {

        if (!image) { return null }

        const canvas = Canvas.createCanvas(image.width, image.height);
        const context = canvas.getContext("2d");

        context.save();
        context.fillStyle = color;
        context.globalAlpha = opacity;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalCompositeOperation = "destination-atop";
        context.globalAlpha = 1;
        context.drawImage(image, 0, 0);
        context.restore();

        return context.canvas;
    }

    /**
     * 
     * @param {{
        image: Canvas.Image,
        mask: Canvas.Image,
        colorsToReplace: [{source: string, target: string}]
     }} settings
     */
    static canvasApplyMask(settings) {
        const image = settings.image;

        if (!image) {
            return null;
        }

        console.log(settings.colorsToReplace);

        if (!settings.mask || !Array.isArray(settings.colorsToReplace)) {
            return image;
        }


        const canvas = Canvas.createCanvas(image.width, image.height);
        const context = canvas.getContext("2d");

        context.save();

        // Multiply if mask drawned before

        context.drawImage(image, 0, 0);

        context.globalCompositeOperation = "multiply";
        let updatedMask = settings.mask;

        for (let colors of settings.colorsToReplace) {
            updatedMask = Utils.canvasReplaceColor(updatedMask, colors.source, colors.target);
        }

        context.drawImage(Utils.canvasRemoveWithMask(image, updatedMask), 0, 0);

        context.restore();

        return context.canvas;
    }

    /**
     * 
     * @param {Canvas.Image} source
     * @param {Canvas.Image} target
     */
    static canvasRemoveWithMask(source, target) {
        const canvas = Canvas.createCanvas(source.width, source.height);
        const context = canvas.getContext("2d");

        context.save();
        context.drawImage(target, 0, 0);
        context.globalCompositeOperation = "destination-atop";
        context.drawImage(source, 0, 0);
        context.restore();

        return context.canvas;
    }

    /**
     * 
     * @param {Canvas.Image} image
     * @param {string} sourceColor
     * @param {string} targetColor
     */
    static canvasReplaceColor(image, sourceColor, targetColor) {
        sourceColor = sourceColor.toLowerCase();
        targetColor = targetColor.toLowerCase();
        const canvas = Canvas.createCanvas(image.width, image.height);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);

        let imgd = context.getImageData(0, 0, image.width, image.height),
            pix = imgd.data;

        // Todo use array of colors instead of x=>y go array of x=>y

        for (let i = 0, n = pix.length; i < n; i += 4) {
            const r = pix[i],
                g = pix[i + 1],
                b = pix[i + 2];
            if (Utils.rgbToHex(r, g, b) == sourceColor) {
                const c = Utils.hexToRgb(targetColor);
                pix[i] = c.r;
                pix[i + 1] = c.g;
                pix[i + 2] = c.b;

            }

            if (Utils.rgbToHex(r, g, b) == "#000000") {
                pix[i] = 255;
                pix[i + 1] = 255;
                pix[i + 2] = 255;
                pix[i+3] = 0;
            }
        }
        context.putImageData(imgd, 0, 0);
        return context.canvas;
    }

    /**
     * 
     * @param {Canvas.Image} image
     * @param {number} deg
     * @returns {Canvas.Canvas}
     */
    static canvasRotateImage(image, deg, rescale = false) {

        if (!image) { return null }

        let width, height;
        if (rescale) {
            let projected = Utils.calcProjectedRectSizeOfRotatedRect(
                image.width, image.height, deg * Math.PI / 180
            );
            width = projected.width;
            height = projected.height;

        } else {
            width = image.width;
            height = image.height;
        }


        const canvas = Canvas.createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.save();
        context.translate(width / 2, height / 2);
        context.rotate(deg * Math.PI / 180);
        context.translate(-width / 2, -height / 2);
        context.drawImage(
            image,
            (width / 2) - (image.width / 2),
            (height / 2) - (image.height / 2),
            image.width,
            image.height);

        //context.restore();

        return context.canvas;
    }

    /**
     * 
     * @param {Canvas.Image} image
     * @param {number} dx
     * @param {number} dy
     * @param {number} width
     * @param {number} height
     * @returns {Canvas.Canvas}
     */
    static canvasCut(image, dx, dy, width, height) {
        const canvas = Canvas.createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.save();
        context.drawImage(image, dx, dy, width, height, 0, 0, width, height);
        context.restore();

        return context.canvas;
    }

    static getRandomHexColor() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    static componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    static rgbToHex(r, g, b) {
        return "#" + Utils.componentToHex(r) + Utils.componentToHex(g) + Utils.componentToHex(b);
    }

    static hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


    static calcProjectedRectSizeOfRotatedRect(width, height, rotation) {
        const {
            cos,
            sin,
            abs,
        } = Math;

        /* eslint-disable max-len */
        const widthAfterRotation = abs(width * sin(rotation)) + abs(height * cos(rotation));
        const heightAfterRotation = abs(width * cos(rotation)) + abs(height * sin(rotation));
        /* eslint-enable max-len */

        return {
            height: widthAfterRotation,
            width: heightAfterRotation,
        };
    }

    /**
     * 
     * @param {string} str
     * @param {number} maxCharacters > 10
     */
    static cutAtLineBreaksIfMoreThan(str, maxCharacters) {
        let arrOfCuttedText = [];

        let cuttedAtLineBreaks = str.split("\n");

        for (let i = 0; i < cuttedAtLineBreaks.length; i++) {
            let cuttedText = cuttedAtLineBreaks[i];

            while (cuttedText.length > maxCharacters) {
                arrOfCuttedText.push(cuttedText.substring(0, maxCharacters - 1));
                cuttedText = cuttedText.substring(maxCharacters - 1);
            }

            while (i < cuttedAtLineBreaks.length - 1 && (cuttedText.length + cuttedAtLineBreaks[i + 1].length + "\n".length) < maxCharacters) {
                cuttedText += "\n" + cuttedAtLineBreaks[i + 1];
                i++;
            }

            arrOfCuttedText.push(cuttedText);
        }


        return arrOfCuttedText;
    }

    static async sendDMToSpecificUser(idUser, message) {
        console.log("send dm: " + message);
        return (await Utils.axiosToUse.post(`/usr`, {
            id: idUser,
            message: message,
        })).data;
    }

    /**
     * 
     * @param {string} err
     * @param {string} msgError
     */
    static prepareStackError(err, msgError) {
        let errorsLines = err.stack.split("\n");
        let nameAndLine = errorsLines[1].split(" ");
        nameAndLine = nameAndLine[nameAndLine.length - 1].split("\\");
        nameAndLine = nameAndLine[nameAndLine.length - 1].split(")")[0];

        msgError += "```js\n" + errorsLines[0] + "\nat " + nameAndLine + "\n```";

        let errorDate = new Date();
        console.log(errorDate.toUTCString());
        console.log(err);

        return msgError;
    }

}


module.exports = Utils