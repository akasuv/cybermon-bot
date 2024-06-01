"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const apiUrl = "https://api.stg.cyberconnect.dev/cybermon";
const linkTelegramWithAddress = (tgId, address) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetch(`${apiUrl}/me/link/tg`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, tgid: tgId + "" }),
    })
        .then((res) => {
        console.log(res);
        return res.json();
    })
        .catch((err) => console.log(err));
});
const checkCybermon = (tgId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetch(`${apiUrl}/me/cybermons?tgid=${tgId + ""}`)
        .then((res) => {
        console.log(res);
        return res.json();
    })
        .catch((err) => console.log(err));
});
const feedCybermon = (cybermonId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("feeding cybermon", cybermonId);
    return yield fetch(`${apiUrl}/cybermon/feed`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cybermon_id: cybermonId }),
    })
        .then((res) => {
        console.log("feeding", res);
        return res.json();
    })
        .catch((err) => console.log(err));
});
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new grammy_1.Bot("7304581316:AAGTAmqq-TddCgUI5j4v4wD3qI6P5NLhpd4"); // <-- put your bot token between the ""
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tgId = (_a = ctx.update.message) === null || _a === void 0 ? void 0 : _a.from.id;
    const address = ctx.match;
    if (tgId && address) {
        ctx.reply(`Bukle up! You're about to start your adventure on Cyberland!`);
        const res = yield linkTelegramWithAddress(tgId, address);
        if (res.success) {
            ctx.reply("Binding successful!");
        }
        else {
            ctx.reply(res.msg);
        }
    }
    else {
        ctx.reply("Please go to https://cybermon.xyz to link your Telegram account");
    }
}));
bot.command("call", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    console.log(ctx.message);
    ctx.reply("Hold on, calling your cybermon... 💫");
    const tgId = (_b = ctx.update.message) === null || _b === void 0 ? void 0 : _b.from.id;
    if (tgId) {
        const res = yield checkCybermon(tgId);
        if (res.data.cybermon_count) {
            const cybermon = res.data.cybermons[0];
            yield ctx.replyWithPhoto(cybermon.picture, {
                caption: `Name: ${cybermon.name}\nLevel: ${cybermon.level}\nEnergy: ${cybermon.energy}\n`,
            });
        }
        else {
            ctx.reply("You don't have any cybermons yet! Get your first Cybermon at https://cybermon.io");
        }
        console.log("res", res);
    }
    // ctx.replyWithSticker();
}));
bot.command("feed", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const tgId = (_c = ctx.update.message) === null || _c === void 0 ? void 0 : _c.from.id;
    if (tgId) {
        ctx.reply("Dinner's ready! Feeding your cybermon... 🍔");
        const res = yield checkCybermon(tgId);
        if (res.data.cybermon_count) {
            const cybermon = res.data.cybermons[0];
            const feedRes = yield feedCybermon(cybermon.id);
            console.log("feedres", feedRes);
            if (feedRes.data.feed_success) {
                ctx.reply("😋 Yum yum");
                const cybermon = feedRes.data.cybermon;
                yield ctx.replyWithPhoto(cybermon.picture, {
                    caption: `Name: ${cybermon.name}\nLevel: ${cybermon.level}\nEnergy: ${cybermon.energy}\n`,
                });
            }
        }
    }
}));
bot.command("battle", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply("🚧 Mon Battle is coming soon! 🏗️");
}));
// Handle other messages.
// bot.on("message", (ctx) => ctx.reply("Got another message!"));
bot.hears("ping", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // `reply` is an alias for `sendMessage` in the same chat (see next section).
    yield ctx.reply("pong", {
        // `reply_parameters` specifies the actual reply feature.
        reply_parameters: { message_id: ctx.msg.message_id },
    });
}));
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
bot.start();
