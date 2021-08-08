const PAGE_SIZE = 10;

const fetch = require('node-fetch');

async function getAllPeople() {
  const {
    results,
    count,
    next
  } = await getPeopleByPage(1);

  let people = results;

  if (next) {
    const promises = [];
    const pagesToFetch = Math.ceil(count / PAGE_SIZE) - 1;
    for (
      let pageNumber = 2; pageNumber < (pagesToFetch + 2); pageNumber += 1) {
      promises.push(getPeopleByPage(pageNumber));
    }

    const promisesResponses = await Promise.all(promises);

    people = [...people, ...promisesResponses.flatMap((response) => response.results)];
  }

  return people;
}

async function getPeopleByPage(page = 1) {
  console.log(`About to fetch https://swapi.dev/api/people?page=${page}`);
  const response = await fetch(`https://swapi.dev/api/people?page=${page}`);
  console.log(`Response https://swapi.dev/api/people?page=${page} statusCode:${response.status}`);

  return response.json();
}

module.exports = {
  getAllPeople

};
