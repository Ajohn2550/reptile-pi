const sensor = require('node-dht-sensor').promises;

sensor.setMaxRetries(5);
sensor.initialize(11, 4);

const ctof = c => c * 9/5 + 32;

function getTemp() {
    sensor.read(11, 4)
    .then((res) => {
        console.log(`Current Temperature: ${ctof(res.temperature)} F Humidity: ${res.humidity.toFixed(1)}%`);
    })
    .catch(console.error)
    .then(() => {
        setTimeout(foo, 5000);
    });
}

getTemp();
