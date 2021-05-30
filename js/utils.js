// export const filterLow = (data, a) => {
//   const dataFiltered = new Array(data.length)
//   dataFiltered[0] = data[0] * (1 - a)
//   for (let i = 0; i < data.length; i++) {
//     dataFiltered[i] = (1 - a) * data[i] + a * dataFiltered[i - 1]
//   }
//   return dataFiltered
// }

export const lowPassFilter = (data, sampling, cutoff) => {
  const dt = 1/sampling
  const tau = 1/(2*Math.PI*cutoff)
  const alpha = dt / (dt + 2*tau)
  const filteredData = new Array(data.length)
  filteredData[0] = 0
  for (let i = 1; i < data.length; i++) {
    filteredData[i] = alpha*(data[i]+data[i-1]) + (1-2*alpha)*filteredData[i-1]
  }
  return filteredData
}

//N = x.shape[0]
//     i = np.arange(N)
//     X = []
//     for k in np.arange(x.shape[0]):
//         X_k = T*(x*np.exp(-1j*2*np.pi*i*k/N)).sum()
//         X.append(X_k)
//     return np.array(X)

import {complex, multiply, sum, exp, pi} from "mathjs";

export const ft = (data) => {
  const N = data.length
  const X = []
  const xs = [...data]

  for (let k = 0; k < N; k++) {
    const c = complex(0, -1)
    const ks = xs.map(x => x * exp(multiply(c, 2 * pi*k*k/N)))
    const Xk = sum(ks)
    console.log("ks", ks)
    X.push(Xk)
  }

  return X
}

export const ft1 = (data) => {
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


