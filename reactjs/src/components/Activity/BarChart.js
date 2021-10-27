import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Caminar', 'Correr', 'Box'],
  datasets: [
    {
      label: 'Calorias a Quemar',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const VerticalBar = () => (
  <>
  <div style={{display:'inline-block'}}>
      Desde:
      <input className="form-control" required type="month" name="fecha_inicial" id="fecha_inicial" />
      Hasta:
      <input className="form-control" required type="month" name="fecha_final" id="fecha_final" />
  </div>
  <Bar data={data} options={options} />
  </>
);

export default VerticalBar;