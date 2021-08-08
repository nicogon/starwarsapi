const PAGE_SIZE = 10;

const fetch = require('node-fetch');

async function getAllPlanets() {
  const {
    results,
    count,
    next
  } = await getPlanetsByPage(1);

  let planets = results;

  if (next) {
    const promises = [];

    const pagesToFetch = Math.ceil(count / PAGE_SIZE) - 1;
    for (
      let pageNumber = 2; pageNumber < (pagesToFetch + 2); pageNumber += 1) {
      promises.push(getPlanetsByPage(pageNumber));
    }

    const promisesResponses = await Promise.all(promises);

    planets = [...planets, ...promisesResponses.flatMap((response) => response.results)];
  }

  return planets;
}

async function getPlanetsByPage(page = 1) {
  console.log(`About to fetch https://swapi.dev/api/planets?page=${page}`);
  const response = await fetch(`https://swapi.dev/api/planets?page=${page}`);
  console.log(`Response https://swapi.dev/api/planets?page=${page} statusCode:${response.status}`);

  return response.json();
}

module.exports = {
  getAllPlanets
};
