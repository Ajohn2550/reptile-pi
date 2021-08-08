const rad   = Math.PI / 180;
const e     = rad * 23.4397;
const dayMs = 86400000 /* 1000 * 60 * 60 * 24 */;
const J0    = 0.0009;
const J1970 = 2440588;
const J2000 = 2451545;

const times = [
    [-0.833, 'sunrise',       'sunset'      ],
    [  -0.3, 'sunriseEnd',    'sunsetStart' ],
    [    -6, 'dawn',          'dusk'        ],
    [   -12, 'nauticalDawn',  'nauticalDusk'],
    [   -18, 'nightEnd',      'night'       ],
    [     6, 'goldenHourEnd', 'goldenHour'  ]
];

const toJulian          = date => date.valueOf() / dayMs - 0.5 + J1970;
const fromJulian        = j => new Date((j + 0.5 - J1970) * dayMs);
const toDays            = date => toJulian(date) - J2000;
const declination       = (l, b) => Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
const solarMeanAnomaly  = d => rad * (357.5291 + 0.98560028 * d);
const eclipticLongitude = M => M + rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) + rad * 102.9372 + Math.PI;
const julianCycle       = (d, lw) => Math.round(d - J0 - lw / (2 * Math.PI));
const aproxTransit      = (Ht, lw, n) => J0 + (Ht + lw) / (2 * Math.PI) + n;
const solarTransitJ     = (ds, M, L) => J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
const hourAngle         = (h, phi, d) => Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d)));
const getSetJ           = (h, lw, phi, dec, n, M, L) => solarTransitJ(aproxTransit(hourAngle(h, phi, dec), lw, n), M, L);

function SunTime(lat, lng) {
    const that = this;
    this.lat = lat;
    this.lng = lng;

    this.getSunTime = (date) => {
        const lw    = rad * -that.lng;
        const phi   = rad * that.lat;
        const d     = toDays(date);
        const n     = julianCycle(d, lw);
        const ds    = aproxTransit(0, lw, n);
        const M     = solarMeanAnomaly(ds);
        const L     = eclipticLongitude(M);
        const dec   = declination(L, 0);
        const Jnoon = solarTransitJ(ds, M, L);
    
        let result = {
            solarNoon: fromJulian(Jnoon),
            nadir: fromJulian(Jnoon + 0.5)
        }
    
        for(const time of times) {
            let Jset  = getSetJ(time[0] * rad, lw, phi, dec, n, M, L);
            let Jrise = Jnoon - (Jset - Jnoon)
            result[time[1]] = fromJulian(Jrise);
            result[time[2]] = fromJulian(Jset);
        }
        return result;
    }

    this.getCurrentSunTime = _ => that.getSunTime(new Date());
    
    this.isDaylight = _ => {
        let now = new Date();
        let currentSunTime = that.getCurrentSunTime();
        return now.getTime() >= currentSunTime.sunrise.getTime() && now.getTime() <= currentSunTime.sunset.getTime();
    }

    this.setLocation = (lat, lng) => {
        that.lat = lat;
        that.lng = lng;
    }
}


module.exports = SunTime;