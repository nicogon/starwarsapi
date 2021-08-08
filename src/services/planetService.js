const planetGateway = require('../gateways/planetGateway');
const cacheService = require('./cacheService');
const peopleService = require('./peopleService');

const PLANETS_CACHE_KEY = 'planets';

module.exports = {
  getAll
};

async function getAll() {
  let planets = cacheService.get(PLANETS_CACHE_KEY);

  if (planets) {
    console.log('Planets is cached, returning cached version');
    return planets;
  }
  console.log('About to get planets form server');

  const partialPlanets = await planetGateway.getAllPlanets();
  const people = await peopleService.getAll();
  planets = partialPlanets.map(planetResidentMapper(people));

  cacheService.set(PLANETS_CACHE_KEY, planets);
  return planets;
}

function planetResidentMapper(people) {
  return function planetResidentMapperInner(planet) {
    return { ...planet, residents: planet.residents.map((residentUrl) => peopleService.getNameByUrl(people, residentUrl)) };
  };
}
