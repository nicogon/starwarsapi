/* eslint-disable radix */
const peopleGateway = require('../gateways/peopleGateway');
const cacheService = require('./cacheService');

const PEOPLE_CACHE_KEY = 'people';

const STRATEGIES = {
  NAME:   'name',
  HEIGHT: 'height',
  MASS:   'mass'
};

module.exports = {
  getAll,
  getNameByUrl
};

async function getAll(sortStrategy) {
  let people = cacheService.get(PEOPLE_CACHE_KEY);

  if (people) {
    console.log('People is cached, returning cached version');
    return sortPeople(people, sortStrategy);
  }
  console.log('About to get people from server');

  people = await peopleGateway.getAllPeople();
  cacheService.set(PEOPLE_CACHE_KEY, people);
  return sortPeople(people, sortStrategy);
}

function getNameByUrl(people, url) {
  const person = people.find(($person) => $person.url === url);
  return person ? person.name : null;
}

function sortPeople(people, sortStrategy) {
  if (sortStrategy === STRATEGIES.NAME) {
    return people.sort((personA, personB) => personA.name.localeCompare(personB.name));
  }
  if (sortStrategy === STRATEGIES.HEIGHT) {
    return people.sort((personA, personB) => parseInt(personA.height) - parseInt(personB.height));
  }
  if (sortStrategy === STRATEGIES.MASS) {
    return people.sort(sortMass);
  }
  return people;
}

function sortMass(personA, personB) {
  const massA = parseInt(personA.mass.replace(/,/g, ''));
  const massB = parseInt(personB.mass.replace(/,/g, ''));
  return  (massA - massB) || (Number.isNaN(massA) - Number.isNaN(massB));
}
