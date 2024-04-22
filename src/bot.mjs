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
  console.log(endpoints.default);
  await fetch(endpoints.projects, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
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
      bot.inlineButton("callback", { callback: "this_is_data" }),
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

// bot.on('/start', async (msg) => {
//     const chatId = msg.from.id;

//     // await bot.sendMessage(msg.from.id,bot.keyboard([['form']], {resize: true}))

//     let replyMarkup = bot.inlineKeyboard([[bot.inlineButton('url', {url: 'https://rococo-wisp-b5b1a7.netlify.app/'})]]);

//     await bot.sendMessage(msg.from.id, 'Check up:', {replyMarkup});

//     // if (msg?.web_app_data?.data) {
//     //     try {
//     //         const data=JSON.parse(msg?.web_app_data?.data)

//     //         await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country)
//     //         await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street)
//     //         await bot.sendMessage(chatId, 'Спасибо за форму!')

//     //         setTimeout(async ()=>{
//     //             await bot.sendMessage(chatId,'Всю  ифнормацию можно получить по... Никак!');
//     //         }, 3000)

//     //     }catch(e){
//     //         console.log(e);
//     //     }

//     // }
// });

export default bot;
