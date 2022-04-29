const Telegraf = require('telegraf').Telegraf;

module.exports = function bot(app) {
    const bot = new Telegraf(app.credentials.telegram.bot);
    
    app.retriver.listener.on( "new_item", ( item ) => {
        app.chats.forEach( chat => {
            var message = `<b>${item.name}</b> is available for purchase!\nBuy now price: <b>${item.current_price}</b>\nPrice in USD: <b>$${item.dollar_price}</b>\nMarket price: <b>${item.market_price}</b>\n<b>Pick up now: </b>${app.config.website}`;
            bot.telegram.sendMessage( chat, message, {parse_mode:"HTML"}  );
        });
    });

    app.retriver.listener.on( "available_again_item", ( item ) => {
        app.chats.forEach( chat => {
            var message = `<b>${item.name}</b> for <b>$${item.dollar_price}</b> is available again for purchase!\n<b>Pick up now: </b>${app.config.website}`;
            bot.telegram.sendMessage( chat, message, {parse_mode:"HTML"}  );
        })
    });

    bot.launch();
}