const moment = require('moment');
const cron = require('node-cron');
const config = require('config');

const SunTime = require('./lib/time/suntime');
const AmbientSensor = require('./lib/sensors/ambient')

const sunTime = new SunTime(config.get('location.latitude'), config.get('location.longitude'));
const tankAmbient = new AmbientSensor(11, config.get('pins.ambient'));


function loop() {
    if(suntime.isDayLight) {
        console.log(`Daytime - Temp set to: ${config.get('temperatures.day')} Current Temp: ${tankAmbient.currentTemperature()}`);
    } else {
        console.log(`Nighttime - Temp set to: ${config.get('temperatures.night')} Current Temp: ${tankAmbient.currentTemperature()}`);
    }
}

cron.schedule('0,15,30,45 * * * * *', loop);