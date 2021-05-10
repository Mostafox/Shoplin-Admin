const { Keyboard, Key } = require("telegram-keyboard");
const { Product } = require("./mongo");

const keyboards = {
  main: Keyboard.make([
    [
      Key.callback("افزودن محصول جدید", "main.newProduct"),
      Key.callback("محصولات", "main.inventory"),
    ],
    [
      Key.callback("سفارش ها", "main.orders"),
      Key.callback("تنظیمات", "main.settings"),
    ],
  ]).inline(),
  newProduct: {
    type: Keyboard.make([
      [
        Key.callback("فایل", "np.type.file"),
        Key.callback("محصول فیزیکی", "np.type.physical"),
        Key.callback("حق عضویت کانال", "np.type.sub"),
      ],
    ]).inline(),

    photo: Keyboard.make([Key.callback("بدون تصویر", "np.nopic")]).inline(),

    final: Keyboard.make([
      Key.callback("تایید نهایی", "np.finalize"),
      Key.callback("انصراف", "np.cancel"),
    ]).inline(),
  },
  inventory: async (ctx) => {
    const items = await Product.find({ user: ctx.from.id });
    if (items.length > 0) {
      let buttons = [];
      for (let i = 0; i < items.length; i++) {
        const element = items[i];
        buttons.push([
          Key.callback(element.name, `inv.main.show.${i}`),
          Key.callback("🗑", `inv.main.del.${i}`),
          Key.callback("📝", `inv.main.edit.${i}`),
        ]);
      }
      return Keyboard.make(buttons).inline();
    } else return null;
  },
  inv: {
    show: (index) => {
      return Keyboard.make([
        [
          Key.callback("🗑 حذف", `inv.show.del.${index}`),
          Key.callback("📝 ویرایش", `inv.show.edit.${index}`),
        ],
      ]).inline();
    },
  },
};

exports.keyboards = keyboards;
