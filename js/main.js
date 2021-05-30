"use strict";
import 'regenerator-runtime/runtime'
import lineChart from './lineChart'
import {lowPassFilter, ft, ft1} from './utils'

document.getElementById('filter-form').addEventListener("submit", onSubmit, false);

async function onSubmit(event) {
  event.preventDefault()

  const sampling = event.target.elements['sampling'].value
  const cutoff = event.target.elements['cutoff'].value
  const bufferedSignalFile = event.target.elements['buffered-signal'].files[0]

  const bufferedSignal = await readSignalFromFile(bufferedSignalFile)
  const filteredData = filter(new Int16Array(bufferedSignal), sampling, cutoff)
  drawChart(filteredData)
  console.log({filteredData: filteredData[1].map(({y}) => y)})
  showLoadableResult(new Float64Array(filteredData[1].map(({y}) => y)))
}

export async function readSignalFromFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      const data = new Int16Array(reader.result)
      resolve(data)
    }
  })
}

function filter(data, sampling, cutoff) {

  const xs = [...Array(data.length).keys()].map(n => n / data.length)

  const xyTest = Array.from(xs).map((x, index) => ({x, y: data[index]}))

  // sample - 4000, 100
  // const yFiltered = lowPassFilter(data, sampling, cutoff)
  const yFiltered = ft1(data).map(({re}) => re)

  console.log({yFiltered})

  const xy = yFiltered.map((y, i) => ({x: xs[i], y}))

  return [xyTest, xy]
}

let chart = null
function drawChart([line1, line2]) {
  if(chart) chart.destroy()
  const ctx = document.getElementById('myChart').getContext('2d');
  chart = lineChart(ctx, [
    {data: line1, label: 'test', color: 'rgb(0,50,246)'},
    {data: line2, label: 'filtered', color: 'rgb(246,21,21)'}
  ])
}

function showLoadableResult(data) {
  const resultLink = document.getElementById("result-loader")
  console.log({buffer: data.buffer})
  const blob = new Blob([data.buffer], {type: 'text/plain'})
  resultLink.href = URL.createObjectURL(blob)
  resultLink.download = "inamov.da1"
  resultLink.classList.remove("hidden")
}
