const { menus } = require("./menus"),
  { keyboards } = require("./keyboards"),
  { TempProduct, Product } = require("./mongo"),
  { showProduct, delProduct } = require("./sideFuncs");

types = {
  file: 1,
  physical: 2,
  sub: 3,
};

const actions = {
  main: {
    newProduct: async (ctx) => menus.newProduct.type(ctx),
    inventory: async (ctx) => menus.inventory(ctx),
  },

  np: {
    type: async (ctx, levels) => {
      menus.newProduct.name(ctx);
      const user = await TempProduct.get(ctx);
      if (user) TempProduct.addField(ctx, { type: types[levels[0]] });
      else
        TempProduct.new({
          user: ctx.from.id,
          type: types[levels[0]],
        });
    },
    nopic: async (ctx) => {
      const temp = await TempProduct.get(ctx);
      if (temp.type == types["file"])
        TempProduct.addField(ctx, { photo: String(temp.type) });
      else TempProduct.addField(ctx, { photo: String(temp.type) });
      menus.newProduct.price(ctx);
    },
    finalize: async (ctx) => {
      TempProduct.saveToProducts(ctx);
      ctx.answerCbQuery("کالای جدید با موفقیت ثبت شد!");
      ctx.deleteMessage();
      menus.main(ctx);
    },
    cancel: async (ctx) => {
      TempProduct.deleteOne({ user: ctx.from.id });
      ctx.answerCbQuery("ثبت کالای جدید لغو شد!");
      ctx.deleteMessage();
      menus.main(ctx);
    },
  },

  inv: {
    main: {
      show: async (ctx, index) =>{
        const data = await Product.find({user: ctx.from.id});
        showProduct(ctx, data[index], keyboards.inv.show(index[0]));
      },
      del: async (ctx, index) => {
        const length = await delProduct(ctx, index[0]);
        if (length == 0) {
          ctx.deleteMessage();
          menus.main(ctx);
        } else menus.inventory(ctx);
      },
    },
    show: {
      del: async (ctx, index) => {
        delProduct(ctx, index[0]);
        ctx.deleteMessage();
        menus.inventory(ctx);
      },
    },
  },
};

const actionHandler = async (ctx, levels) => {
  let func = actions[levels[0]];
  let i = 1;
  while (func[levels[i]]) {
    func = func[levels[i]];
    i++;
  }

  if (func) {
    if (levels[i]) func(ctx, levels.slice(i));
    else func(ctx);
  } else ctx.answerCbQuery("خطا!");
};

exports.actions = actionHandler;
