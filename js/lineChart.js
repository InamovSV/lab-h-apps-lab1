import Chart from 'chart.js'

export default function (ctx, dataset) {

  const datasets = dataset.map(({data, label, color}) => ({
    fill: false,
    data: data,
    borderColor: [color || randomColor()],
    borderWidth: 1,
    label,
    pointRadius: 0
  }))

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Blue', 'Yellow'],
      datasets: datasets
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

export const randomColor = () => {
  const randomTone = () => Math.floor(Math.random() * 255)
  return `rgba(${randomTone()}, ${randomTone()}, ${randomTone()})`
}
