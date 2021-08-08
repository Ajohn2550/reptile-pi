const cron = require('node-cron');
const config = require('config');
const server = require('./lib/server/index');

const SunTime = require('./lib/time/suntime');
const AmbientSensor = require('./lib/sensors/ambient')
const Relays = require('./lib/relays');

const sunTime = new SunTime(config.get('location.latitude'), config.get('location.longitude'));
const tankAmbient = new AmbientSensor(11, config.get('pins.ambient'));
const tankRelays = new Relays(config.get('relays'));

const ambientTemps = config.get("temperatures");

function loop() {
    let currentLog = '';
    if(sunTime.isDaylight()) {
        currentLog += `Day   - CT: ${tankAmbient.currentTemperature} `;

        if(tankAmbient.currentTemperature < ambientTemps.day.low) {
            tankRelays.dayHeat();
        } else if (tankAmbient.currentTemperature >= ambientTemps.day.low && tankAmbient.currentTemperature < ambientTemps.day.high) {
            tankRelays.dayBask();;
        } else {
            tankRelays.dayCool();
        }

        currentLog += `Relays: ${tankRelays.status().main} `;
        currentLog += `Set: ${ambientTemps.day.low}-${ambientTemps.day.high}`;

    } else {
        currentLog += `Night - CT: ${tankAmbient.currentTemperature} `;

        if(tankAmbient.currentTemperature < ambientTemps.night.low) {
            tankRelays.nightHeat();
        } else if(tankAmbient.currentTemperature >= ambientTemps.night.low && tankAmbient.currentTemperature < ambientTemps.night.high) {
            tankRelays.off();
        } else {
            tankRelays.nightCool();
        }

        currentLog += `Relays: ${tankRelays.status().main} `;
        currentLog += `Set: ${ambientTemps.night.low}-${ambientTemps.night.high}`;
    }
    console.log(currentLog);
}

function shutdown() {
    tankRelays.off();
    setInterval(_ => {
        tankRelays.on();
    }, 500);
}
server(tankRelays, { ambient: tankAmbient });

cron.schedule('0,15,30,45 * * * * *', loop);
process.on('exit', shutdown());