import requests
import plotly.graph_objects as go
import pandas as pd
import json

# Your OpenWeatherMap API key
api_key = "d856eee0a9ba74ced4da1b3bc0dddd42"

# Define states in India and their coordinates
states = {
    "Andhra Pradesh": (15.9129, 79.7400),
    "Jammu and Kashmir": (34.0837, 74.7973),
    "Arunachal Pradesh": (28.2180, 94.7278),
    "Assam": (26.2006, 92.9376),
    "Bihar": (25.0961, 85.3131),
    "Chhattisgarh": (21.2787, 81.8661),
    "Goa": (15.2993, 74.1240),
    "Gujarat": (22.2587, 71.1924),
    "Haryana": (29.0588, 76.0856),
    "Himachal Pradesh": (31.1048, 77.1734),
    "Jharkhand": (23.6102, 85.2799),
    "Karnataka": (15.3173, 75.7139),
    "Kerala": (10.8505, 76.2711),
    "Madhya Pradesh": (22.9734, 78.6569), # this is only for bhopal division and also include the areal representation using cartopi
    "Maharashtra": (19.7515, 75.7139),
    "Manipur": (24.6637, 93.9063),
    "Meghalaya": (25.4670, 91.3662),
    "Mizoram": (23.1645, 92.9376),
    "Nagaland": (26.1584, 94.5624),
    "Odisha": (20.9517, 85.0985),
    "Punjab": (31.1471, 75.3412),
    "Rajasthan": (27.0238, 74.2179),
    "Sikkim": (27.5330, 88.5122),
    "Tamil Nadu": (11.1271, 78.6569),
    "Telangana": (18.1124, 79.0193),
    "Tripura": (23.9408, 91.9882),
    "Uttar Pradesh": (26.8467, 80.9462),
    "Uttarakhand": (30.0668, 79.0193),
    "West Bengal": (22.9868, 87.8550),
    "Andaman and Nicobar Islands": (11.7401, 92.6586),
    "Chandigarh": (30.7333, 76.7794),
    "Dadra and Nagar Haveli and Daman and Diu": (20.1809, 73.0169),
    "Lakshadweep": (10.5667, 72.6417),
    "Delhi": (28.7041, 77.1025),  # Delhi is considered a Union Territory
    "Puducherry": (11.9416, 79.8083)
}

# Fetch weather data for states and compute average temperatures
state_temps = {}
for state, (lat, lon) in states.items():
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()
    if data["cod"] == 200:
        state_temps[state] = data["main"]["temp"]
    else:
        print(f"Error getting weather data for {state}")

# Prepare the data for the choropleth map
df = pd.DataFrame(list(state_temps.items()), columns=['State', 'Temperature'])

# Load the GeoJSON file for Indian states boundaries
with open('india_state.geojson') as f:
    india_states = json.load(f)

# Create a choropleth map
fig = go.Figure(go.Choropleth(
    geojson=india_states,
    featureidkey='properties.NAME_1',  # Key in the GeoJSON file to match the states
    locations=df['State'],
    z=df['Temperature'],
    colorscale='Reds',
    colorbar_title='Temperature (°C)',
))

fig.update_geos(fitbounds="locations", visible=False)
fig.update_layout(title_text='Temperature Heat Map of Indian States', title_x=0.5)

# Show the plot
fig.show()
