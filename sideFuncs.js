const {Product} = require('./mongo');

const DEFAULT_FILE_PIC = {
    file:'AgACAgQAAxkBAAIB9l_x2CPIg1DbW_CfLJPwcFnHP_q_AAIMtTEbwF2QU_jG-F6KCmiLwrqjJ10AAwEAAwIAA20AA7rcAwABHgQ',
    physical:'AgACAgQAAxkBAAIB9l_x2CPIg1DbW_CfLJPwcFnHP_q_AAIMtTEbwF2QU_jG-F6KCmiLwrqjJ10AAwEAAwIAA20AA7rcAwABHgQ',
    subscription:'AgACAgQAAxkBAAIB9l_x2CPIg1DbW_CfLJPwcFnHP_q_AAIMtTEbwF2QU_jG-F6KCmiLwrqjJ10AAwEAAwIAA20AA7rcAwABHgQ',
}

const types = {
    1:'file',
    2:'physical',
    3:'subscription'
}


const showProduct = async (ctx, data, keyboard = null) => {
  let photo;
  if (parseInt(data.photo) < 9) {
    photo = DEFAULT_FILE_PIC[types[data.photo]];
  } else photo = data.photo;
  const caption = `نام کالا: ${data.name}\nتوضیحات: ${data.description}\nقیمت: ${data.price}`;
  if (keyboard)
    ctx.replyWithPhoto(photo, {
      caption: caption,
      parse_mode: "Markdown",
      ...keyboard,
    });
  else ctx.replyWithPhoto(photo, { caption: caption });
}

const delProduct = async (ctx, index) =>{
  let data = await Product.find({ user: ctx.from.id });
  if(data[index[0]]){
    await Product.deleteOne({ _id: data[index[0]]._id });
    ctx.answerCbQuery("با موفقیت حذف شد!");
    return data.length -1;
  }
  else ctx.answerCbQuery('خطا!')
}


exports.showProduct = showProduct;
exports.delProduct = delProduct;