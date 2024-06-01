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

const feedCybermon = async (cybermonId: number) => {
  console.log("feeding cybermon", cybermonId);
  return await fetch(`${apiUrl}/cybermon/feed`, {
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
};

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot("7304581316:AAGTAmqq-TddCgUI5j4v4wD3qI6P5NLhpd4"); // <-- put your bot token between the ""

bot.command("start", async (ctx) => {
  const tgId = ctx.update.message?.from.id;
  const address = ctx.match;

  if (tgId && address) {
    ctx.reply(`Bukle up! You're about to start your adventure on Cyberland!`);
    const res = await linkTelegramWithAddress(tgId, address);
    if (res.success) {
      ctx.reply("Binding successful!");
    } else {
      ctx.reply(res.msg);
    }
  } else {
    ctx.reply(
      "Please go to https://cybermon.xyz to link your Telegram account",
    );
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
      await ctx.replyWithPhoto(cybermon.picture, {
        caption: `Name: ${cybermon.name}\nLevel: ${cybermon.level}\nEnergy: ${cybermon.energy}\n`,
      });
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
  const tgId = ctx.update.message?.from.id;
  if (tgId) {
    ctx.reply("Dinner's ready! Feeding your cybermon... 🍔");
    const res = await checkCybermon(tgId);

    if (res.data.cybermon_count) {
      const cybermon = res.data.cybermons[0];
      const feedRes = await feedCybermon(cybermon.id);

      console.log("feedres", feedRes);

      if (feedRes.data.feed_success) {
        const cybermon = feedRes.data.cybermon;
        await ctx.replyWithPhoto(cybermon.picture, {
          caption: `Name: ${cybermon.name}\nLevel: ${cybermon.level}\nEnergy: ${cybermon.energy}\n`,
        });
        ctx.reply("😋 Yum yum");
      }
    }
  }
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
