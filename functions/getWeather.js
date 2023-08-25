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



app.get('/.netlify/functions/getMovies', async (req, res) => {
  try {
    const { city } = req.query;
        res.setHeader('Access-Control-Allow-Origin', 'https://magenta-stardust-08f1b6.netlify.app');

    const movieEndpoint = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${city}`;
    const response = await axios.get(movieEndpoint);

    if (response.status !== 200) {
      res.status(500).json({ message: 'Failed to fetch movies.' });
      return;
    }

    const top5Movies = response.data.results.slice(0, 5);
    res.json(top5Movies);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});



module.exports.handler = serverlessHttp(app);
