const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Vercel requires exporting the app
module.exports = app;
