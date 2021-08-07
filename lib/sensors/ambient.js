const sensor = require('node-dht-sensor').promises;
const ctof = require('../temperature').ctof;

class AmbientSensor{
    #temperature;
    #humidity;
    #pin;
    #type;
    #lastupdate;

    constructor(type, pin) {
        console.log('Constructor');
        this.#type = type;
        this.#pin = pin;
        sensor.setMaxRetries(2);
        sensor.initialize(type, pin);
        this.update();
    }

    get currentTemperature() {
        console.log('currentTemperature');
        this.checkCache();
        return this.#temperature;
    }

    get currentHumidity() {
        console.log('currentHumidity');
        this.checkCache();
        return this.#humidity;
    }

    checkCache() {
        console.log('checkCache');
        if(new Date() - this.#lastupdate > 1500) {
            console.log('cacheExpired');
            this.update();
        }
        return;
    }

    async update() {
        console.log('update')
        try {
            const res = await sensor.read(this.#type, this.#pin);
            this.#temperature = ctof(res.temperature);
            this.#humidity = res.humidity.toFixed(1);
            this.#lastupdate = new Date();
        }
        catch(err){
            console.error();
        }
        return;
    }
}

module.exports = AmbientSensor;