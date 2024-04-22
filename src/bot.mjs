import TeleBot from "telebot";
import endpoints from "./endpoints.js";
const bot = new TeleBot({
  token: process.env.TELEGRAM_BOT_TOKEN,
  usePlugins: ["askUser", "floodProtection"],
  pluginConfig: {
    floodProtection: {
      interval: 2,
      message: "Too many messages, relax!",
    },
  },
});
const WebUrlit = "https://rococo-wisp-b5b1a7.netlify.app/";

// On commands
bot.on(["/start", "/back"], async (msg) => {
  let replyMarkup = bot.keyboard(
    [
      ["/buttons", "/inlineKeyboard"],
      ["/start", "/hide"],
    ],
    { resize: true }
  );
  return bot.sendMessage(msg.from.id, "HI", { replyMarkup });
});

// On start command
bot.on("/start", (msg) => {
  const id = msg.from.id;

  // Ask user name
  return bot.sendMessage(id, "What is your name?", { ask: "name" });
});

// Ask name event
bot.on("ask.name", (msg) => {
  const id = msg.from.id;
  const name = msg.text;

  // Ask user age
  return bot.sendMessage(id, `Nice to meet you, ${name}! How old are you?`, {
    ask: "age",
  });
});

// Ask age event
bot.on("ask.age", (msg) => {
  const id = msg.from.id;
  const age = Number(msg.text);

  if (!age) {
    // If incorrect age, ask again
    return bot.sendMessage(id, "Incorrect age. Please, try again!", {
      ask: "age",
    });
  } else {
    // Last message (don't ask)
    return bot.sendMessage(id, `You are ${age} years old. Great!`);
  }
});
// Buttons
bot.on("/buttons", (msg) => {
  let replyMarkup = bot.keyboard(
    [
      [
        bot.button("contact", "Your contact"),
        bot.button("location", "Your location"),
      ],
      ["/back", "/hide"],
    ],
    { resize: true }
  );

  return bot.sendMessage(msg.from.id, " ", { replyMarkup });
});

// Hide keyboard
bot.on("/hide", (msg) => {
  return bot.sendMessage(
    msg.from.id,
    "Hide keyboard example. Type /back to show.",
    { replyMarkup: "hide" }
  );
});

// On location on contact message
bot.on(["location", "contact"], (msg, self) => {
  return bot.sendMessage(msg.from.id, `Thank you for ${self.type}.`);
});

// Inline buttons
bot.on("/inlineKeyboard", (msg) => {
  let replyMarkup = bot.inlineKeyboard([
    [
      bot.inlineButton("callback", { callback: "callbackQuery" }),
      bot.inlineButton("inline", { inline: "some query" }),
    ],
    [bot.inlineButton("url", { url: "https://telegram.org" })],
  ]);

  return bot.sendMessage(msg.from.id, "Inline keyboard example.", {
    replyMarkup,
  });
});

// Inline button callback
bot.on("callbackQuery", (msg) => {
  // User message alert
  return bot.answerCallbackQuery(
    msg.id,
    `Inline button callback: ${msg.data}`,
    true
  );
});

// Inline query
bot.on("inlineQuery", (msg) => {
  const query = msg.query;
  const answers = bot.answerList(msg.id);

  answers.addArticle({
    id: "query",
    title: "Inline Query",
    description: `Your query: ${query}`,
    message_text: "Click!",
  });

  return bot.answerQuery(answers);
});

bot.on("inlineQuery", (msg) => {
  let query = msg.query;
  console.log(`inline query: ${query}`);

  // Create a new answer list object
  const answers = bot.answerList(msg.id, { cacheTime: 60 });

  // Article
  answers.addArticle({
    id: "query",
    title: "Inline Title",
    description: `Your query: ${query}`,
    message_text: "Click!",
  });

  // Photo
  answers.addPhoto({
    id: "photo",
    caption: "Telegram logo.",
    photo_url: "https://telegram.org/img/t_logo.png",
    thumb_url: "https://telegram.org/img/t_logo.png",
  });

  // Gif
  answers.addGif({
    id: "gif",
    gif_url: "https://telegram.org/img/tl_card_wecandoit.gif",
    thumb_url: "https://telegram.org/img/tl_card_wecandoit.gif",
  });

  // Send answers
  return bot.answerQuery(answers);
});

export default bot;
