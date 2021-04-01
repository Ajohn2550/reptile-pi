const sensor = require('node-dht-sensor');

sensor.read(11, 4, (err, temperature, humidity) => {
    if(!err) {
        console.log(`Temp: ${temperature} C Dumidity: ${humidity}%`);
    } else {
        console.err(err);
    }
});

