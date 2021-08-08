const express = require('express');

const peopleService = require('./services/peopleService');
const planetService = require('./services/planetService');

const app = express();
const port = process.env.PORT || 3000;

app.get('/people', async function (req, res) {
  const sortStrategy = req.query.sortBy;
  const people = await peopleService.getAll(sortStrategy);
  res.json(people);
});

app.get('/planets', async function (req, res) {
  const people = await planetService.getAll();
  res.json(people);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
