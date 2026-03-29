
const temp = document.getElementById("temp"),
  date = document.getElementById("date-time"),
  currentLocation = document.getElementById("location"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIcon = document.getElementById("icon"),  
  windSpeed = document.querySelector(".wind-speed"),
  humidity = document.querySelector(".humidity"),
  visibility = document.querySelector(".visibility"), 
  humidityStatus = document.querySelector(".humidity-status"),
  airQuality = document.querySelector(".air-quality"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibility-status"); 
  //thunderstormChance = document.getElementById("thunderstorm-chance");
   
  weatherCards = document.querySelector("#weather-cards"),
  celciusBtn = document.querySelector(".celcius"),
  fahrenheitBtn = document.querySelector(".fahrenheit"),
  hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  searchForm = document.querySelector("#search"),
  search = document.querySelector("#query");
 
let currentCity = "";
let currentUnit = "C";
let hourlyorWeek = "Week";

function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
      minute = now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  hour = hour % 12;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  let dayString = days[now.getDay()];
  return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);
function getPublicIp() {
  fetch("https://geolocation-db.com/json/",
  {
    method: "GET",
  })
    .then((response) => response.json())
      .then((data) => {
        console.log(data);
        currentCity = data.city;
        getWeatherData(data.city, currentUnit, hourlyorWeek);
    });
}
getPublicIp();

const thunderstormChance = document.getElementById("thunderstorm-chance");

function getWeatherData(city, unit, hourlyorWeek) {
  console.log(city);
  const apiKey = "2VXNCLWCN2QYBZTHRJU89EP8Q";
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);  // Log the entire response data
      let today = data.days[0].hours[0]; // Assuming you want to use the first hour's data
      if (unit === "C") {
        temp.innerText = today.temp;
      } else {
        temp.innerText = celciusToFahrenheit(today.temp);
      }
      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      rain.innerText = "Perc - " + today.precip + "%";
      windSpeed.innerText = today.windspeed;
      humidity.innerText = today.humidity + "%";
      visibility.innerText = today.visibility;
      airQuality.innerText = today.winddir;
      measureHumidityStatus(today.humidity);
      mainIcon.src = getIcon(today.icon);
      
      // Calculate thunderstorm chance based on conditions
      thunderstormChance.innerText = isThunderstormLikely(data.description, today.humidity, today.precip);
      
      if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, unit, "day");
      } else {
        updateForecast(data.days, unit, "week");        
      }
    })
    .catch((err)=>{
      alert("Invalid Entry ");
    });
}

function celciusToFahrenheit(temp) {
  console.log(temp);
  return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}

function isThunderstormLikely(description, humidity, rain) {
  // Check if weather description indicates thunderstorms or if humidity and rain are high
  if (description.toLowerCase().includes('thunderstorm') || (humidity > 40 &&rain > 1)) {
    return "Thunderstorms are likely";
  } else {
    return "No thunderstorms forecasted";
  }
}



  

function getIcon(condition) {
  if (condition === "Partly-cloudy-day") {
    return "27.png";
  } else if (condition === "partly-cloudy-night") {
    return "15.png";
  } else if (condition === "rain") {
    return "39.png";
  } else if (condition === "clear-day") {
    return "26.png";
  } else if (condition === "clear-night") {
    return "10.png";
  } else {
    return "26.png";
  }
}

function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}
function getHour(time) {
  let hour = time.split(":")[0];
  let min = time.split(":")[1];
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
}
function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = 0;
  if (type === "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = getHour(data[day].datetime);
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    }
    let dayTemp = data[day].temp;
    if (unit === "F") {
      dayTemp = celciusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    if (unit === "F") {
      tempUnit = "°F";
    }
    card.innerHTML = `

                        <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
      
      `;
    weatherCards.appendChild(card);
    day++;
  }
}

fahrenheitBtn.addEventListener("click", () => {
  changeUnit("F");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("C");
});

function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    {
      tempUnit.forEach((elem) => {
        elem.innerText = `°${unit.toUpperCase()}`;
      });
      if (unit === "c") {
        celciusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
      } else {
        celciusBtn.classList.remove("active");
        fahrenheitBtn.classList.add("active");
      }
      getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
  }
}

hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

function changeTimeSpan(unit) {
  if (hourlyorWeek !== unit) {
    hourlyorWeek = unit;
    if (unit === "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    currentCity = location;
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
});

// Existing JavaScript code

const currentLocationBtn = document.getElementById("current-location-btn");

currentLocationBtn.addEventListener("click", () => {
    getCurrentLocationWeather();
});

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherByCoordinates(latitude, longitude);
        }, (error) => {
            console.error("Error getting current location:", error.message);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function getWeatherByCoordinates(latitude, longitude) {
    const apiKey = "2VXNCLWCN2QYBZTHRJU89EP8Q";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=${apiKey}&contentType=json`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Update the weather details using the data
            updateWeatherDetails(data);
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error.message);
        });
}

function updateWeatherDetails(data) {
    let today = data.currentConditions;
    if (currentUnit === "C") {
        temp.innerText = today.temp;
    } else {
        temp.innerText = celciusToFahrenheit(today.temp);
    }
    currentLocation.innerText = data.resolvedAddress;
    condition.innerText = today.conditions;
    rain.innerText = "Perc -" + today.precip + "%";
    windSpeed.innerText = today.windspeed;
    humidity.innerText = today.humidity + "%";
    visibility.innerText = today.visibility;
    airQuality.innerText = today.winddir;
    measureHumidityStatus(today.humidity);
    mainIcon.src = getIcon(today.icon);
    if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, currentUnit, "day");
    } else {
        updateForecast(data.days, currentUnit, "week");
    }
}




const apiKey = "2VXNCLWCN2QYBZTHRJU89EP8Q";

// Function to fetch weather data from Visual Crossing Weather API
function fetchWeatherData(city) {
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}`;

  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      throw error;
    });
}

// Function to render Temperature Chart
function renderTemperatureChart(data) {
  const temperatures = data.days.map(day => day.temp);
  
  Highcharts.chart('temperatureChart', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Temperature Forecast'
    },
    xAxis: {
      categories: data.days.map(day => day.datetime)
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      }
    },
    series: [{
      name: 'Temperature',
      data: temperatures,
      tooltip: {
        valueSuffix: ' °C'
      }
    }]
  });
}

// Function to render Rain Chart
function renderRainChart(data) {
  const rains = data.days.map(day => day.precip);
  
  Highcharts.chart('rainChart', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Rain Forecast'
    },
    xAxis: {
      categories: data.days.map(day => day.datetime)
    },
    yAxis: {
      title: {
        text: 'Rainfall (mm)'
      }
    },
    series: [{
      name: 'Rain',
      data: rains,
      tooltip: {
        valueSuffix: ' mm'
      }
    }]
  });
}

// Function to render Humidity Chart
function renderHumidityChart(data) {
  const humidities = data.days.map(day => day.humidity);
  
  Highcharts.chart('humidityChart', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Humidity Forecast' 
    },
    xAxis: {
      categories: data.days.map(day => day.datetime)
    },
    yAxis: {
      title: {
        text: 'Humidity (%)'
      }
    },
    series: [{
      name: 'Humidity',
      data: humidities,
      tooltip: {
        valueSuffix: ' %'
      }
    }]
  });
}

// Example function to update weather details and render charts
function updateWeatherDetails(data) {
  renderTemperatureChart(data);
  renderRainChart(data);
  renderHumidityChart(data);
}

// Example usage after fetching weather data
const city = 'New York'; // Replace with your desired city
fetchWeatherData(city)
  .then(data => {
    updateWeatherDetails(data);
  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please try again later.');
  });




