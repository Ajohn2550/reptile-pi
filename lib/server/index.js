const express = require('express');



function server(relays, sensors) {
    const app = express();

    app.get('/api/status', (req, res) => {
        res.json({
            relays: relays.status(),
            temps: {
                ambient: {
                    temp: sensors.ambient.currentTemperature,
                    humidity: sensors.ambient.currentHumidity
                }
            }
        })
    });




    app.listen(3000);
}

module.exports = server;
