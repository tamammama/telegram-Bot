const axios = require("axios").default;
const fs = require("fs").promises;

module.exports = async function fetch(app) {
    var response = await axios.post("https://fut-sell.com/home/get_all_players", {
        Headers: ["Access-Control-Allow-Origin"]
    });
    if( !Array.isArray(response.data) ){
        return;
    }
    var data = response.data.map(item => {
        let name = item.Player_Name.replace(/\n/g, "").replace(/\s\s+/, " ").trim();
        let fd = name.match(/\d/);
        let ind = name.indexOf(fd);
        var new_name = name.slice(0, ind) + "(" + name.slice(ind) + ")";
        return {
            name: new_name,
            market_price: parseFloat(item.Market_Price).toLocaleString(),
            current_price: parseFloat(item.Buy_Now_Price).toLocaleString(),
            dollar_price: parseFloat(item.Price_Dollar).toLocaleString(),
            status: parseInt(item.Status),
            /// distinctify
            Chemistry_Style: item.Chemistry_Style,
            Start_Price: item.Start_Price,
            Owners: item.Owners,
            Contracts: item.Contracts,
            Action_Time: item.Action_Time,
            Platform: item.Platform
        }
    }).filter( item => ( [0,1].includes(item.status) ) );

    // filter cache from items that doesn't exist in the retrived data
    var new_cache = app.retriver.cache.filter(item => data.some( new_item => {
        var i = {}, ni = {};
        Object.assign( i, item );
        Object.assign( ni, new_item );
        delete ni.status; delete i.status;
        return JSON.stringify(ni) == JSON.stringify(i);
    }));

    // get retrived data that aren't found in the cache
    var new_data = data.filter(new_item => {
        return !app.retriver.cache.some( item => {
            return JSON.stringify(item) == JSON.stringify(new_item);
        });
    });

    // apply filtered cache    
    Object.assign( app.retriver.cache, new_cache );

    // do actions for new data/status
    new_data.forEach( async new_item => {
        let cached_index = app.retriver.cache.findIndex( item => {
            var i = {}, ni = {};
            Object.assign( i, item );
            Object.assign( ni, new_item );
            delete ni.status; delete i.status;
            return JSON.stringify(ni) == JSON.stringify(i);
        });
        if( cached_index >= 0 ){
            if( app.retriver.cache[cached_index].status >= 1 && new_item.status == 0 ){
                await app.retriver.listener.emit( "available_again_item", new_item );
            }
            app.retriver.cache[cached_index].status = new_item.status;
        }else{
            app.retriver.listener.emit("new_item", new_item);
            app.retriver.cache.push( new_item );
        };
    });
};