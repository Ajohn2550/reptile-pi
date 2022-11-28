const express = require('express');



function server(relays, sensors, history) {
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
        });
    });

    app.post('/api/lock', (req, res) => {
        relays.lock();
        res.json({
            success: true
        });
    });

    app.post('/api/unlock', (req, res) => {
        relays.unlock();
        res.json({
            success: true
        });
    });

    app.get('/api/history', (req, res) => {
        res.json({ history: history.get()});
    });

    app.post('/api/relays/:state', (req, res) => {
        switch(req.params.state) {
            case 'on':
                relays.on();
                break;
            case 'off':
                relays.off();
                break;
            case 'sun':
                relays.sun();
                break;
            case 'heat':
                relays.sun();
                break;
            case 'bask':
                relays.bask();
                break;
            case 'disp':
                relays.disp();
                break;
            case 'nightHeat':
                relays.nightHeat();
                break;
            case 'nightCool':
                relays.nightCool();
                break;
            case 'dayBask':
                relays.dayBask();
                break;
            case 'dayHeat':
                relays.dayHeat();
                break;
            case 'dayCool':
                relays.dayCool();
                break;
            default:
                break; 
        }
        res.json({
            relays: relays.status(),
            temps: {
                ambient: {
                    temp: sensors.ambient.currentTemperature,
                    humidity: sensors.ambient.currentHumidity
                }
            }
        });
    })



    app.listen(3000);
}

module.exports = server;
