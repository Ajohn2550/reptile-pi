const sensor = require('node-dht-sensor').promises;
const ctof = require('../temperature').ctof;

class AmbientSensor{
    #temperature;
    #humidity;
    #pin;
    #type;
    #lastupdate;

    constructor(type, pin) {
        this.#type = type;
        this.#pin = pin;
        sensor.setMaxRetries(2);
        sensor.initialize(type, pin);
        this.update();
    }

    get currentTemperature() {
        this.checkCache();
        return this.#temperature;
    }

    get currentHumidity() {
        this.checkCache();
        return this.#humidity;
    }

    checkCache() {
        if(new Date().getTime() - this.#lastupdate > 1500) {
            this.update();
        }
        return;
    }

    async update() {
        try {
            const res = await sensor.read(this.#type, this.#pin);
            this.#temperature = ctof(res.temperature);
            this.#humidity = res.humidity.toFixed(1);
            this.#lastupdate = new Date();
        }
        catch(err){
            console.error(err);
        }
        return;
    }
}

module.exports = AmbientSensor;