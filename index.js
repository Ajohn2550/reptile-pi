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
        console.log(`Daytime - Temp set to: ${config.get('temperatures.day')} Current Temp: ${tankAmbient.currentTemperature}`);
        tankRelays.dayBask();
    } else {
        console.log(`Nighttime - Temp set to: ${config.get('temperatures.night')} Current Temp: ${tankAmbient.currentTemperature}`);
        tankRelays.nightHeat();
    }
}

loop();
cron.schedule('0,15,30,45 * * * * *', loop);