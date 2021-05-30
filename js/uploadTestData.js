const testSignals = new Int16Array([...Array(1000).keys()].map(n => n / 1000)).buffer

const fs = require('fs');

fs.writeFile("../data", testSignals)
