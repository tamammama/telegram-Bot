const config = require("./config");
const retriver = require("./modules/retriver/index");
const bot = require("./modules/bot/index");

module.exports = class APP {
    async start() {
        await config( this );
        await retriver( this );
        bot( this );

        this.retriver.listener.on( "new_item", ( item ) => {
            console.log( "Detected a new item: ", item.name );
        });
        this.retriver.listener.on( "available_again_item", ( item ) => {
            console.log( "New available item: ", item.name );
        });        
    }
}