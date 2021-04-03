const SunCalc = require('suncalc-tz');
const moment = require('moment');
const cron = require('node-cron');
const sensor = require('node-dht-sensor').promises;
const config = require('config');

let sunrise;
let sunset;

function updateDaylight() {
    let suntime = SunCalc.getTimes(
        Date.now(),
        config.get('location.latitude'),
        config.get('location.longitude')
    );
    sunrise = suntime.sunrise;
    sunset = suntime.sunset;
    console.log(`Updating Daylight. Sunrise: ${sunrise} Sunset: ${sunset}`);
}

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
    let isDatytime = moment().isBetween(sunrise, sunset);

    if(isDatytime) {
        console.log(`Daytime - Temp set to: ${config.get('temperatures.day')}`);
    } else {
        console.log(`Nighttime - Temp set to: ${config.get('temperatures.night')}`);
    }
    getTemp();
}

updateDaylight();
cron.schedule('* * * * *', updateDaylight);
cron.schedule('0,15,30,45 * * * * *', loop);