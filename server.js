const express = require('express');
const path = require('path');
const app = express();
const PORT = 3009;

// ... any other middleware or routes ...

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'weather.json'));

     const { lat, lon, searchQuery } = req.query; // extract the parameters from the request

  if (!lat || !lon || !searchQuery) {
    return res.status(400).send("Missing required query parameters: lat, lon, or searchQuery");
  }

  const city = cities.find(c => 
    c.lat === parseFloat(lat) && 
    c.lon === parseFloat(lon) && 
    c.searchQuery.includes(searchQuery.toLowerCase())
  );

  if (!city) {
    return res.status(404).send("City not found or search query did not match any city.");
  }

  res.send(city);



});

// Catch-all for undefined routes
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
