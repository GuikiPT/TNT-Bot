const figlet = require('figlet-promised');
const colors = require('colors/safe');

figlet('TNT 2.0').then(async function(result){
    try{
        await console.log(colors.bold(colors.red(result)));
        await require(__dirname + '/main.js');
    }
    catch (err) {
        console.error(colors.red(err.stack || err));
    }
});