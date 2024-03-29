const { keyboards } = require("./keyboards"),
  { Session, TempProduct } = require("./mongo"),
  { showProduct } = require("./sideFuncs");

const menus = {
  main: async (ctx) =>{
    ctx.reply("منوی اصلی:", keyboards.main)
  },
  // new product section
  newProduct: {
    type: async (ctx) => {
      const user = await Session.getLevel(ctx);
      ctx.editMessageText("نوع کالا را انتخاب کنید", keyboards.newProduct.type);
      if (user) Session.changeLevel(ctx, "np.type");
      else Session.new(ctx, "np.type");

    },
    name: async (ctx) => {
      ctx.editMessageText("نام محصول را وارد کنید:");
      Session.changeLevel(ctx, "np.name");
    },
    description: async (ctx) => {
      ctx.reply(
        "لطفا توضیحات کالا را وارد کنید:(توضیحات باید کمتر از 100 کاراکتر باشد!)"
      );
      Session.changeLevel(ctx, "np.description");
    },
    photo: async (ctx) => {
      ctx.reply(
        "لطفا تصویر یا آلبوم عکس کالا را ارسال کنید یا بر روی گزینه ی بدون تصویر کلیک کنید:",
        keyboards.newProduct.photo
      );
      Session.changeLevel(ctx, "np.photo");
    },
    price: (ctx) => {
      ctx.editMessageText("لطفا قیمت کالا را به تومان وارد کنید:");
      Session.changeLevel(ctx, "np.price");
    },
    payment: async (ctx) => {
      ctx.reply("لطفا لینک درگاه پرداخت محصول را وارد کنید:");
      Session.changeLevel(ctx, "np.payment");
    },
    final: async (ctx) => {
      Session.changeLevel(ctx, "np.final");
      const temp = await TempProduct.get(ctx);
      showProduct(ctx, temp, keyboards.newProduct.final);
    },
  },

  //inventory section
  inventory: async (ctx) => {
    await Session.changeLevel(ctx, "inventory");
    keyboard = await keyboards.inventory(ctx);

    if (keyboard) {
      try {
        await ctx.editMessageText("لیست محصولات:", keyboard);
      } catch (err) {
        await ctx.reply("لیست محصولات:", keyboard);
      }
    } else {
      try {
        await ctx.answerCbQuery("در حال حاضر محصولی وجود ندارد!");
      } catch (error) {
        await ctx.reply("در حال حاضر محصولی وجود ندارد!");
        await menus.main(ctx);
      }
    }
  },
};

exports.menus = menus;
