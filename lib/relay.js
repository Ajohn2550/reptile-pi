const Gpio = require('onoff').Gpio;

class Relay{
    #name;
    #pin;
    #status;

    constructor(name, pin) {
        this.#name = name;
        this.#pin = new Gpio(pin, 'out');
    }

    get status() {
        return this.#status;
    }

    get name() {
        return this.#name;
    }

    on() {
        this.#pin.write(1);
        this.#status = true;
    }

    off() {
        this.#pin.write(0);
        this.#status = false;
    }
}

module.exports = Relay;