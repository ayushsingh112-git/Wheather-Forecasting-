document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('weatherGraph').getContext('2d');
  
  const data = {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
          {
              label: 'Temperature (°C)',
              data: [30, 31, 32, 33, 34, 35, 36],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          },
          {
              label: 'Humidity (%)',
              data: [70, 65, 60, 55, 50, 45, 40],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }
      ]
  };

  const config = {
      type: 'line',
      data: data,
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  };

  const weatherGraph = new Chart(ctx, config);
});
