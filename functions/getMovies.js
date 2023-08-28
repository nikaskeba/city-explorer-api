const express = require('express');
const serverlessHttp = require('serverless-http');
const axios = require('axios');
const cors = require('cors');
const app = express();
const cache = {};

app.use(cors({
    origin: 'https://magenta-stardust-08f1b6.netlify.app'
}));




app.get('/.netlify/functions/getMovies', async (req, res) => {
  try {
    const { city } = req.query;

    // Check if we have cached results for the requested city
    if (cache[city]) {
      return res.json(cache[city]);
    }

    // If not in cache, fetch from the third-party API
    const movieEndpoint = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${city}`;
    const response = await axios.get(movieEndpoint);

    if (response.status !== 200) {
      res.status(500).json({ message: 'Failed to fetch movies.' });
      return;
    }

    const top5Movies = response.data.results.slice(0, 5);

    // Cache the results before sending them
    cache[city] = top5Movies;
    
    res.json(top5Movies);
    
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});




module.exports.handler = serverlessHttp(app);
