const figlet = require('figlet-promised');
const colors = require('colors/safe');
const Spinnies = require('spinnies');
const cliSpinners = require('cli-spinners');

figlet('TNT 2.0').then(async function (result) {
    try {
        await console.log(colors.bold(colors.red(result)));

        const spinnies = new Spinnies({ color: 'yellow', succeedColor: 'green', spinner: { interval: cliSpinners.simpleDotsScrolling.interval, frames: cliSpinners.simpleDotsScrolling.frames }});
        spinnies.add('startingBot', { text: 'Starting the Bot', color: 'white' });

        await require(__dirname + '/main.js')(spinnies);
    }
    catch (err) {
        console.error(colors.red(err.stack || err));
    }
});