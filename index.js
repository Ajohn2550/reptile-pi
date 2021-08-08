const moment = require('moment');
const cron = require('node-cron');
const config = require('config');

const SunTime = require('./lib/time/suntime');
const AmbientSensor = require('./lib/sensors/ambient')
const Relays = require('./lib/relays');

const sunTime = new SunTime(config.get('location.latitude'), config.get('location.longitude'));
const tankAmbient = new AmbientSensor(11, config.get('pins.ambient'));
const tankRelays = new Relays(config.get('relays'));

function loop() {
    if(sunTime.isDayLight) {
        tankRelays.dayBask();
        console.log(`Daytime   - Temp set to: ${config.get('temperatures.day')} Current Temp: ${tankAmbient.currentTemperature} Relay Status: ${tankRelays.status().main}`);
    } else {
        tankRelays.nightHeat();
        console.log(`Nighttime - Temp set to: ${config.get('temperatures.night')} Current Temp: ${tankAmbient.currentTemperature} Relay Status: ${tankRelays.status().main}`);
    }
}

function startup() {
    let currentSunTime = sunTime.getCurrentSunTime();

    console.log(new Date());
    console.log(sunTime.isDaylight);
    console.dir(currentSunTime);
    loop();
}


startup();
cron.schedule('0,15,30,45 * * * * *', loop);