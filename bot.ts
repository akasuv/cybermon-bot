import { Bot } from "grammy";
const apiUrl = "https://api.stg.cyberconnect.dev/cybermon";

const linkTelegramWithAddress = async (tgId: number, address: string) => {
  return await fetch(`${apiUrl}/me/link/tg`, {
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
};

const checkCybermon = async (tgId: number) => {
  return await fetch(`${apiUrl}/me/cybermons?tgid=${tgId + ""}`)
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .catch((err) => console.log(err));
};

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot("7304581316:AAGTAmqq-TddCgUI5j4v4wD3qI6P5NLhpd4"); // <-- put your bot token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("bind", (ctx) => ctx.reply("Please provide your address"));
bot.command("start", async (ctx) => {
  console.log(ctx, ctx.update.message?.entities);
  const tgId = ctx.update.message?.from.id;
  const address = ctx.match;

  console.log(tgId, address);

  if (tgId && address) {
    const res = await linkTelegramWithAddress(tgId, address);
    if (res.success) {
      ctx.reply("Binding successful!");
    } else {
      ctx.reply(res.msg);
    }
  }
});
bot.command("call", async (ctx) => {
  console.log(ctx.message);

  ctx.reply("Hold on, calling your cybermon... 💫");
  const tgId = ctx.update.message?.from.id;
  if (tgId) {
    const res = await checkCybermon(tgId);

    if (res.data.cybermon_count) {
      const cybermon = res.data.cybermons[0];
      await ctx.replyWithPhoto(
        "https://i.pinimg.com/736x/4b/7f/43/4b7f43b8f360f547141203ffa3500682.jpg",
        {
          caption: `Mon Status:\nName: ${cybermon.name}\nLevel: ${cybermon.level}\nEnergy: ${cybermon.energy}\n`,
        },
      );
    } else {
      ctx.reply(
        "You don't have any cybermons yet! Get your first Cybermon at https://cybermon.io",
      );
    }

    console.log("res", res);
  }
  // ctx.replyWithSticker();
});

bot.command("feed", async (ctx) => {
  ctx.reply("Yum yum");
});

bot.command("battle", async (ctx) => {
  ctx.reply("🚧 Mon Battle is coming soon! 🏗️");
});

// Handle other messages.
// bot.on("message", (ctx) => ctx.reply("Got another message!"));
bot.hears("ping", async (ctx) => {
  // `reply` is an alias for `sendMessage` in the same chat (see next section).
  await ctx.reply("pong", {
    // `reply_parameters` specifies the actual reply feature.
    reply_parameters: { message_id: ctx.msg.message_id },
  });
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
