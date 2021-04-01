const sensor = require('node-dht-sensor');

sensor.read(11, 4, (err, temperature, humidity) => {
    if(!err) {
        let ftemp = temperature * (9/5) + 32;
        console.log(`Temp: ${ftemp} C Dumidity: ${humidity}%`);
    } else {
        console.err(err);
    }
});

