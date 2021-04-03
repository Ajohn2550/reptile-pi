const SunCalc = require('suncalc-tz');
const moment = require('moment');
const cron = require('node-cron');
const sensor = require('node-dht-sensor').promises;

const lat = '33.448376';
const lon = '-112.074036';
const dayTemp = 100;
const nightTemp = 75;

const suntime = SunCalc.getTimes(Date.now(), lat, lon);
const sunrise = suntime.sunrise;
const sunset = suntime.sunset;

sensor.setMaxRetries(5);
sensor.initialize(11, 4);

const ctof = c => c * 9/5 + 32;

function getTemp() {
    sensor.read(11, 4)
    .then((res) => {
        console.log(`Current Temperature: ${ctof(res.temperature)} F Humidity: ${res.humidity.toFixed(1)}%`);
    })
    .catch(console.error);
}

function loop() {
    console.log(`Current Time: ${moment().format()} \nSunrize: ${sunrise}\nSunset: ${sunset}`)
    let isDatytime = moment().isBetween(sunrise, sunset);

    if(isDatytime) {
        console.log(`Daytime - Temp set to: ${dayTemp}`);
    } else {
        console.log(`Nighttime - Temp set to: ${nightTemp}`);
    }
    getTemp();
}

cron.schedule('0,15,30,45 * * * * *', loop);