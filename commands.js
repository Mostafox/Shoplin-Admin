const {menus} = require('./menus');

const commands = {
    start: async (ctx) => menus.main(ctx),
    menu: async (ctx) => menus.main(ctx),
    products: async (ctx) => menus.inventory(ctx),
}

const commandHandler = async (ctx) => {
    
}
exports.commands = commands;