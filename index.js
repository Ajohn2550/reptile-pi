const SunCalc = require('suncalc-tz');
const moment = require('moment');
const cron = require('node-cron');
const config = require('config');
const AmbientSensor = require('./lib/sensors/ambient')

const tankAmbient = new AmbientSensor(11, config.get('pins.ambient'));
let sunrise;
let sunset;
let ttemp = 75;

function updateDaylight() {
    let suntime = SunCalc.getTimes(Date.now(), config.get('location.latitude'), config.get('location.longitude'));
    sunrise = suntime.sunrise;
    sunset = suntime.sunset;
    console.log(`Updating Daylight. Sunrise: ${sunrise} Sunset: ${sunset}`);
}

const isDayLight = () => moment().isBetween(sunrise, sunset);

function loop() {
    if(isDayLight) {
        console.log(`Daytime - Temp set to: ${config.get('temperatures.day')} Current Temp: ${tankAmbient.currentTemperature()}`);
    } else {
        console.log(`Nighttime - Temp set to: ${config.get('temperatures.night')} Current Temp: ${tankAmbient.currentTemperature()}`);
    }
}

updateDaylight();
cron.schedule('* * * * *', updateDaylight);
cron.schedule('0,15,30,45 * * * * *', loop);