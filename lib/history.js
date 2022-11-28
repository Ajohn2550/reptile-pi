class History {
    #history;

    constructor() {
        this.#history = [];
    }

    log(relays, temps) {
        this.#history.push({
            timeStamp: Date.now().toString(),
            relays,
            temps
        });
    }

    get() {
        return this.#history;
    }

    rotate() {
        this.#history = [];
    }
}

module.exports = History;
