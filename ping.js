/// for test purposes, ping the website api
/// usage: node ping *or* npm run ping

const axios = require("axios").default;
var ping = async () => {
    var response = await axios.post("https://fut-sell.com/home/get_all_players", {
        Headers: ["Access-Control-Allow-Origin"]
    });
    console.log( response.data );
    ping();
}
ping();