const express = require('express');
const serverlessHttp = require('serverless-http');
const axios = require('axios');

const app = express();

app.get('/.netlify/functions/getWeather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
 // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://magenta-stardust-08f1b6.netlify.app');

    const weatherEndpoint = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${process.env.REACT_APP_WEATHERBIT_API_KEY}`;
    const response = await axios.get(weatherEndpoint);

    if (response.status !== 200) {
      res.status(500).json({ message: 'Failed to fetch weather data.' });
      return;
    }

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

module.exports.handler = serverlessHttp(app);
