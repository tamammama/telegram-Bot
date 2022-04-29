const fs = require("fs/promises"), path = require("path");

module.exports = function config( app ){
    app.config = require("../config.json");
    app.credentials = require("../credentials.json");
    app.chats = require("../chats.json");
    app.root = path.join(__dirname,"../");
}