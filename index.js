/// entry point for the application
/// usage: node index *or* npm start

const APP = require("./src/app");
const app = new APP();
app.start();