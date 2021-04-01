const sensor = require('node-dht-sensor');

sensor.read(11, 4, (err, temperature, humidity) => {
    if(!err) {
        let ftemp = temperature * (5/9) + 32;
        console.log(`Temp: ${ftemp} C Dumidity: ${humidity}%`);
    } else {
        console.err(err);
    }
});

