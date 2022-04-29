const events = require("events");
const retrive = require("./retrive");

module.exports = function init(app) {
    app.retriver = {};
    app.retriver.listener = new events.EventEmitter();
    app.retriver.cache = [];
    app.retriver.retrive = retrive;
    app.retriver.interval = setInterval( () => {
        app.retriver.retrive( app );
    }, app.config.interval );
}