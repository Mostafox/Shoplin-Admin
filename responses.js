const { menus } = require("./menus"),
  { TempProduct } = require("./mongo");
const responses = {
  newProduct: {
    name: async (ctx) => {
      if (ctx.message.text)
        if (ctx.message.text.length < 50) {
          menus.newProduct.description(ctx);
          await TempProduct.addField(ctx, { name: ctx.message.text });
        } else ctx.reply("نام کالا حداکثر میتواند 50 کاراکتر باشد!");
    },
    description: async (ctx) => {
      if (ctx.message.text) {
        if (ctx.message.text.length < 101) {
          menus.newProduct.photo(ctx);
          await TempProduct.addField(ctx, { description: ctx.message.text });
        } else ctx.reply("توضیحات کالا حداکثر میتواند 100 کاراکتر باشد!");
      }
    },
    photo: async (ctx) => {
      const photo = ctx.message.photo;
      menus.newProduct.price(ctx);
      if (photo[photo.length - 1]) {
        await TempProduct.addField(ctx, {
          photo: photo[photo.length - 1].file_id,
        });
      }
    },
    price: async (ctx) => {
      const text = ctx.message.text;

      const isnum = /^\d+$/.test(text);
      if (isnum) {
        await TempProduct.addField(ctx, { price: text });
        menus.newProduct.final(ctx);
      } else ctx.reply("لطفا فقط عدد وارد کنید!");
    },
  },
};

exports.responses = responses;
