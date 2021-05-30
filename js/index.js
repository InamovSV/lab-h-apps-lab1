
const fs = require('fs')

const data = fs.readFileSync('data/test.dat')

const math = require('mathjs')
const ft = (data) => {
    const N = data.length
    const X = []
    const xs = [...data]

    for (let k = 0; k < N; k++) {
        const c = math.complex('-1i')
        const ks = xs.map(x => x * math.exp(math.multiply(c, 2 * math.pi*k*k/N)))
        const Xk = math.sum(ks)
        X.push(Xk)
    }

    return X
}

const ft1 = (data) => {
    const N = data.length;
    const frequencies = [];

    // for every frequency...
    for (let freq = 0; freq < N; freq++) {
        let re = 0;
        let im = 0;

        // for every point in time...
        for (let t = 0; t < N; t++) {

            // Spin the signal _backwards_ at each frequency (as radians/s, not Hertz)
            const rate = -1 * (2 * Math.PI) * freq;

            // How far around the circle have we gone at time=t?
            const time = t / N;
            const distance = rate * time;

            // datapoint * e^(-i*2*pi*f) is complex, store each part
            const re_part = data[t] * Math.cos(distance);
            const im_part = data[t] * Math.sin(distance);

            // add this data point's contribution
            re += re_part;
            im += im_part;
        }

        // Close to zero? You're zero.
        if (Math.abs(re) < 1e-10) { re = 0; }
        if (Math.abs(im) < 1e-10) { im = 0; }

        // Average contribution at this frequency
        re = re / N;
        im = im / N;

        frequencies[freq] = {
            re: re,
            im: im,
            freq: freq,
            amp: Math.sqrt(re*re + im*im),
            phase: Math.atan2(im, re) * 180 / Math.PI     // in degrees
        };
    }

    return frequencies;
}

function filter(data) {

    const xs = [...Array(data.length).keys()].map(n => n / data.length)

    const xyTest = Array.from(xs).map((x, index) => ({x, y: data[index]}))

    // sample - 4000, 100
    // const yFiltered = lowPassFilter(data, sampling, cutoff)
    const yFiltered = ft1(data)

    console.log({yFiltered})

    const xy = yFiltered.map((y, i) => ({x: xs[i], y}))

    return [xyTest, xy]
}


filter(new Int16Array(data))