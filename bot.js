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
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new grammy_1.Bot("7304581316:AAGTAmqq-TddCgUI5j4v4wD3qI6P5NLhpd4"); // <-- put your bot token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.
// Handle the /start command.
bot.command("bind", (ctx) => ctx.reply("Please provide your address"));
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(ctx, (_a = ctx.update.message) === null || _a === void 0 ? void 0 : _a.entities);
    const tgId = (_b = ctx.update.message) === null || _b === void 0 ? void 0 : _b.from.id;
    const address = ctx.match;
    console.log(tgId, address);
    if (tgId && address) {
        const res = yield linkTelegramWithAddress(tgId, address);
        if (res.success) {
            ctx.reply("Binding successful!");
        }
        else {
            ctx.reply(res.msg);
        }
    }
}));
bot.command("call", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    console.log(ctx.message);
    ctx.reply("Hold on, calling your cybermon... 💫");
    const tgId = (_c = ctx.update.message) === null || _c === void 0 ? void 0 : _c.from.id;
    if (tgId) {
        const res = yield checkCybermon(tgId);
        if (res.data.cybermon_count) {
            const cybermon = res.data.cybermons[0];
            yield ctx.replyWithPhoto("https://i.pinimg.com/736x/4b/7f/43/4b7f43b8f360f547141203ffa3500682.jpg", {
                caption: `Mon Status:\nName: ${cybermon.name}\nLevel: ${cybermon.level}\nEnergy: ${cybermon.energy}\n`,
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
    ctx.reply("Yum yum");
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
