const { getSunrise, getSunset } = require('sunrise-sunset-js');
const moment = require('moment');
const sensor = require('node-dht-sensor').promises;

const lat = '33.448376';
const lon = '-112.074036';
const dayTemp = 100;
const nightTemp = 75;

const sunrise = getSunrise(lat, lon);
const sunset = getSunset(lat, lon);

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
    setInterval(loop, 5000);
    let isDatytime = moment().isBetween(sunrise, sunset);

    if(isDatytime) {
        console.log(`Daytime - Temp set to: ${dayTemp}`);
    } else {
        console.log(`Nighttime - Temp set to: ${nightTemp}`);
    }
    getTemp();

}

loop();