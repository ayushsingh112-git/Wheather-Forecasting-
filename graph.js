// // Initialize the map
// const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

// // Add OpenStreetMap tiles
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; OpenStreetMap contributors'
// }).addTo(map);

// // Function to get weather data and add to map
// async function addWeatherLayer(layer) {
//     const apiKey = '4f944c0231428c0ac6ebf79e36eba04d';
//     const url = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`;
//     const weatherLayer = L.tileLayer(url, {
//         attribution: 'Weather data &copy; OpenWeatherMap',
//         maxZoom: 19
//     });
//     weatherLayer.addTo(map);
// }

// // Event listener for the weather control
// document.getElementById('weatherLayer').addEventListener('change', function() {
//     const selectedLayer = this.value;
//     map.eachLayer(function(layer) {
//         if(layer.options.attribution && layer.options.attribution.includes('OpenWeatherMap')) {
//             map.removeLayer(layer);
//         }
//     });
//     addWeatherLayer(selectedLayer);
// });

// // Initial weather layer
// addWeatherLayer('temp_new');


// // Initialize the map centered on India
// const map = L.map('map', {
//     center: [20.5937, 78.9629], // Centered on India
//     zoom: 5
// });

// // Add OpenStreetMap tiles
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; OpenStreetMap contributors'
// }).addTo(map);

// // Function to add GeoJSON data for Indian states boundaries
// async function addIndianStatesBoundaries() {
//     const response = await axios.get('https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson');
//     const indiaStates = L.geoJSON(response.data, {
//         style: {
//             color: '#3388ff',
//             weight: 2,
//             opacity: 1,
//             fillOpacity: 0.1
//         },
//         onEachFeature: onEachFeature
//     }).addTo(map);
//     map.fitBounds(indiaStates.getBounds());
// }

// // Function to get weather data for a given latitude and longitude
// async function getWeatherData(lat, lon) {
//     const apiKey = '4f944c0231428c0ac6ebf79e36eba04d';
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
//     const response = await axios.get(url);
//     return response.data;
// }

// // Function to handle each feature (state) on the map
// function onEachFeature(feature, layer) {
//     layer.on({
//         click: showWeatherInfo
//     });
// }

// // Function to show weather info on click
// async function showWeatherInfo(e) {
//     const layer = e.target;
//     const { lat, lng } = layer.getBounds().getCenter();
//     const weatherData = await getWeatherData(lat, lng);

//     const infoDiv = document.getElementById('info');
//     infoDiv.innerHTML = `
//         <strong>${layer.feature.properties.NAME_1}</strong><br>
//         Temperature: ${weatherData.main.temp}°C<br>
//         Wind Speed: ${weatherData.wind.speed} m/s<br>
//         Clouds: ${weatherData.clouds.all}%<br>
//         Rain: ${weatherData.rain ? weatherData.rain['1h'] || weatherData.rain['3h'] : 'No data'} mm<br>
//         Thunderstorm: ${weatherData.weather.some(item => item.main === 'Thunderstorm') ? 'Yes' : 'No'}
//     `;

//     layer.setStyle({
//         weight: 5,
//         color: '#666',
//         dashArray: '',
//         fillOpacity: 0.7
//     });

//     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//         layer.bringToFront();
//     }
// }

// // Function to get weather data and add to map
// async function addWeatherLayer(layer) {
//     const apiKey = '4f944c0231428c0ac6ebf79e36eba04d';
//     const url = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`;
//     const weatherLayer = L.tileLayer(url, {
//         attribution: 'Weather data &copy; OpenWeatherMap',
//         maxZoom: 19
//     });
//     weatherLayer.addTo(map);
// }

// // Event listener for the weather control
// document.getElementById('weatherLayer').addEventListener('change', function() {
//     const selectedLayer = this.value;
//     map.eachLayer(function(layer) {
//         if(layer.options.attribution && layer.options.attribution.includes('OpenWeatherMap')) {
//             map.removeLayer(layer);
//         }
//     });
//     addWeatherLayer(selectedLayer);
// });

// // Initial weather layer and India state boundaries
// addWeatherLayer('temp_new');
// addIndianStatesBoundaries();

// Initialize the map centered on India
const map = L.map('map', {
    center: [20.5937, 78.9629], // Centered on India
    zoom: 5,
    minZoom: 5
});

// Add OpenStreetMap tiles with enhanced contrast
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to add GeoJSON data for Indian states boundaries
async function addIndianStatesBoundaries() {
    const response = await axios.get('https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson');
    const indiaStates = L.geoJSON(response.data, {
        style: {
            color: '#3388ff', // Boundary color
            weight: 2,
            opacity: 1,
            fillOpacity: 0.1,
            fillColor: '#3388ff' // Fill color
        },
        onEachFeature: onEachFeature
    }).addTo(map);
    map.fitBounds(indiaStates.getBounds());
}

// Function to get weather data for a given latitude and longitude
async function getWeatherData(lat, lon) {
    const apiKey = '4f944c0231428c0ac6ebf79e36eba04d';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    return response.data;
}

// Function to handle each feature (state) on the map
function onEachFeature(feature, layer) {
    layer.on({
        click: showWeatherInfo,
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

// Function to show weather info on click
async function showWeatherInfo(e) {
    const layer = e.target;
    const { lat, lng } = layer.getBounds().getCenter();
    const weatherData = await getWeatherData(lat, lng);

    const infoDiv = document.getElementById('info');
    infoDiv.innerHTML = `
        <strong>${layer.feature.properties.NAME_1}</strong><br>
        Temperature: ${weatherData.main.temp}°C<br>
        Wind Speed: ${weatherData.wind.speed} m/s<br>
        Clouds: ${weatherData.clouds.all}%<br>
        Rain: ${weatherData.rain ? weatherData.rain['1h'] || weatherData.rain['3h'] : 'No data'} mm<br>
        Thunderstorm: ${weatherData.weather.some(item => item.main === 'Thunderstorm') ? 'Yes' : 'No'}
    `;

    layer.setStyle({
        weight: 5,
        color: '#666', // Border color on click
        dashArray: '',
        fillOpacity: 0.7,
        fillColor: '#3388ff' // Fill color on click
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Function to reset highlight on mouseout
function resetHighlight(e) {
    const layer = e.target;
    const defaultStyle = {
        weight: 2,
        color: '#3388ff', // Boundary color
        fillOpacity: 0.1,
        fillColor: '#3388ff' // Fill color
    };
    layer.setStyle(defaultStyle);
}

// Function to highlight feature on mouseover
function highlightFeature(e) {
    const layer = e.target;
    const highlightStyle = {
        weight: 5,
        color: '#666', // Border color on hover
        fillOpacity: 0.7,
        fillColor: '#3388ff' // Fill color on hover
    };
    layer.setStyle(highlightStyle);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Function to get weather data and add to map
async function addWeatherLayer(layer) {
    const apiKey = '4f944c0231428c0ac6ebf79e36eba04d';
    const url = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`;
    const weatherLayer = L.tileLayer(url, {
        attribution: 'Weather data &copy; OpenWeatherMap',
        maxZoom: 19
    });
    weatherLayer.addTo(map);
    return weatherLayer;
}

// Variables for animation
let animationInterval;
let currentIndex = 0;
let weatherLayers = [];

// Function to fetch forecast data
async function getForecastData() {
    const apiKey = '4f944c0231428c0ac6ebf79e36eba04d';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=20.5937&lon=78.9629&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    return response.data.list;
}

// Function to start animation
async function startAnimation() {
    const forecastData = await getForecastData();

    animationInterval = setInterval(async () => {
        if (currentIndex >= forecastData.length) {
            currentIndex = 0;
        }
        
        const currentData = forecastData[currentIndex];
        const { dt_txt } = currentData;
        const weatherLayerType = document.getElementById('weatherLayer').value;
        
        map.eachLayer(function(layer) {
            if(layer.options.attribution && layer.options.attribution.includes('OpenWeatherMap')) {
                map.removeLayer(layer);
            }
        });
        
        const newLayer = await addWeatherLayer(weatherLayerType);
        weatherLayers.push(newLayer);

        const infoDiv = document.getElementById('info');
        infoDiv.innerHTML = `
            <strong>${dt_txt}</strong><br>
            Displaying: ${weatherLayerType}
        `;
        
        currentIndex++;
    }, 1000);
}

// Function to stop animation
function stopAnimation() {
    clearInterval(animationInterval);
    currentIndex = 0;
}

// Event listener for the weather control
document.getElementById('weatherLayer').addEventListener('change', function() {
    map.eachLayer(function(layer) {
        if(layer.options.attribution && layer.options.attribution.includes('OpenWeatherMap')) {
            map.removeLayer(layer);
        }
    });
    addWeatherLayer(this.value);
});

// Event listeners for animation controls
document.getElementById('startAnimation').addEventListener('click', startAnimation);
document.getElementById('stopAnimation').addEventListener('click', stopAnimation);

// Initial weather layer and India state boundaries
addWeatherLayer('temp_new');
addIndianStatesBoundaries();








