const fs = require('fs');

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
        let nday = new Date();
        let year = nday.getFullYear();
        let month = nday.getMonth() + 1;
        let day = nday.getDate();

        let filename = `${year}-${month}-${day}.json`;

        let output = JSON.stringify({ history: this.#history });
        this.#history = [];
        fs.writeFileSync(`../storage/${filename}`, output, (err) => {
            console.error(err);
        });

    }
}

module.exports = History;
