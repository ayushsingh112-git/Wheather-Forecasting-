# Weather1

A simple weather visualization project using HTML, JavaScript, and geojson data.

## Project Structure

- `index.html` - main page for weather features
- `graph.html` - graph-based representation
- `heatmap.html` - heatmap visualization
- `script.js`, `chart.js`, `graph.js`, `geolocation.js` - core JavaScript logic
- `styles.css` - styles
- `india_state.geojson` - map data for India states
- `app.py` - backend script (if used for local data fetching)

## Prerequisites

- Modern web browser (Chrome, Firefox, Edge)
- Optional: Python 3 for running `app.py`

## Usage

1. Open `index.html` in your browser.
2. Use provided controls to view weather data visualizations.
3. For local server mode, run:

   ```bash
   python -m http.server 8000
   ```

   then visit `http://localhost:8000`.

## Notes

- Verify the scripts refer to correct paths if files are moved.
- Update the README as features are added.
