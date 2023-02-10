const { Telegraf } = require("telegraf"),
  TelegrafLogger = require("telegraf-logger"),
  { actions } = require("./actions"),
  { responses } = require("./responses"),
  { Session, db } = require("./mongo"),
  {commands} = require('./commands');

const token = "1394076165:AAFkyi47Ns4qjVNblAM1oVgS8dpeOrs3dnU";

const bot = new Telegraf(token);


bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.on("document", async (ctx) => {
  const link = await ctx.telegram.getFileLink(ctx.message.document.file_id);
  console.log(link);
});

const logger = new TelegrafLogger({
  log: console.log,
  format: "%ut => @%u %fn id=%fi ci=%ci: <%ust> %c",
  contentLength: 100,
});
bot.use(logger.middleware());

bot.on("callback_query", async (ctx) => {
  const callback = ctx.callbackQuery.data;
  const levels = callback.split(".");
  actions(ctx, levels);
});
//inventory actions

bot.on("text", async (ctx) => {
  const level = await Session.getLevel(ctx);
  
  let message = await ctx.message.text;
  if(message.startsWith('/')){
    message = await message.split('/')[1];
    await commands[message](ctx);
    return;
  }
  

  switch (level.level) {
    case "np.name":
      responses.newProduct.name(ctx);
      break;
    case "np.description":
      responses.newProduct.description(ctx);
      break;
    case "np.price":
      responses.newProduct.price(ctx);
      break;
    case 'np.payment':
      responses.newProduct.payment(ctx);
      break;
  }
});

bot.on("photo", async (ctx) => {
  const level = await Session.getLevel(ctx);
  switch (level.level) {
    case "np.photo":
      await responses.newProduct.photo(ctx);
      break;
  }
});

console.log('Connecting to DB')
db.once("open", () => {
  console.log('mongo connected')
  bot.launch();
});
