const weatherData = require('./data/weather.json'); // Assuming weather.json is in a "data" folder at the same level as your server file.
const express = require('express');
const cors = require('cors');
const serverlessHttp = require('serverless-http');
const app = express();
// Setup CORS
const corsOptions = {
  origin: 'https://magenta-stardust-08f1b6.netlify.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  if (!lat || !lon || !searchQuery) {
      return res.status(400).send("Missing required query parameters: lat, lon, or searchQuery");
  }

  // Search for a matching city
  const city = weatherData.find(c => 
    c.lat === lat && 
    c.lon === lon && 
    c.city_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!city) {
      return res.status(404).send("City not found or search query did not match any city.");
  }

  res.send(city);
});

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

const extractForecasts = (cityData) => {
    const forecasts = cityData.data.map(day => {
        const date = day.valid_date;
        const description = day.weather.description;
        return new Forecast(date, description);
    });
    return forecasts;
}


// Catch-all for undefined routes
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports.handler = serverlessHttp(app);
