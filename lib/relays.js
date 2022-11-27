const Relay = require('./relay');

class Relays {
    sun;
    heat;
    bask;
    disp;
    #status;
    #locked;

    constructor(relays) {
        this.sun  = new Relay('sun',  relays.sun);
        this.heat = new Relay('heat', relays.heat);
        this.bask = new Relay('bask', relays.bask);
        this.disp = new Relay('disp', relays.disp);

        this.on();
        this.off();
        this.on();
        this.#status = 'init';
        this.#locked = false;
    }

    toggle(_status, _sun, _heat, _bask, _disp) {
        if(!this.#locked) {
            this.#status = _status;
            _sun  ? this.sun.on()  : this.sun.off();
            _heat ? this.heat.on() : this.heat.off();
            _bask ? this.bask.on() : this.bask.off();
            _disp ? this.disp.on() : this.disp.off();
        }
    }

    lock() {
        this.#locked = true;
    }

    unlock() {
        this.#locked = false;
    }

    off() {
        this.toggle('Off', false, false, false, false);
    }

    on() {
        this.toggle('On', true, true, true, true);
    }

    sun() {
        this.toggle('Sun', true, false, false, false);
    }

    heat() {
        this.toggle('Heat', false, true, false, false);
    }

    bask() {
        this.toggle('Basking', false, false, true, false);
    }

    display() {
        this.toggle('Display', false, false, false, true);
    }

    nightHeat() {
        this.toggle('Night Heat', false, true, false, false);
    }

    nightCool() {
        this.toggle('Night cool', false, false, false, false);
    }

    dayBask() {
        this.toggle('Day Basking', true, false, true, true,)
    }

    dayHeat() {
        this.toggle('Day Heating', true, true, true, true);
    }

    dayCool() {
        this.toggle('Day Cooling', true, false, false, true);
    }

    status() {
        return {
            main: this.#status,
            locked: this.locked,
            sun:  this.sun.status,
            heat: this.heat.status,
            bask: this.bask.status,
            disp: this.disp.status
        }
    }
}

module.exports = Relays;
