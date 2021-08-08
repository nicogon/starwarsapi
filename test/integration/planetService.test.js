const nock = require('nock');
const fs = require('fs');
const sinon = require('sinon');
const { expect } = require('chai');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const planetService = require('../../src/services/planetService');
const peopleGateway = require('../../src/gateways/peopleGateway');
const planetGateway = require('../../src/gateways/planetGateway');
const cacheService = require('../../src/services/cacheService');

chai.use(sinonChai);

describe('peopleService Integration tests', () => {
  beforeEach(() => {
    cacheService.flushAll();
    sinon.restore();
  });
  describe('function getAll()', () => {
    let planets;
    let getAllPeopleGatewaySpy;
    let getAllPlanetsGatewaySpy;
    context('when calling getAll() for the first time', () => {
      before(async () => {
        getAllPeopleGatewaySpy = sinon.spy(peopleGateway, 'getAllPeople');
        getAllPlanetsGatewaySpy = sinon.spy(planetGateway, 'getAllPlanets');

        nock('https://swapi.dev')
          .get('/api/people?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse1.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/people?page=2')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse2.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/planets?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/planetsResponse.json`, { 'Content-Type': 'application/json' });

        planets = await planetService.getAll();
      });

      it('should call peopleGateway.getAllPeople once', () =>  expect(getAllPeopleGatewaySpy).to.have.been.calledOnce);

      it('should call planetGateway.getAllPlanets once', () =>  expect(getAllPlanetsGatewaySpy).to.have.been.calledOnce);

      it('people response should be correct', () => expect(planets).to.eql(
        JSON.parse(
          fs.readFileSync(`${__dirname}/resources/expectedPlanetsResponse.json`,  'utf8')
        )
      ));
    });

    context('when calling getAll() twice', () => {
      before(async () => {
        getAllPeopleGatewaySpy = sinon.spy(peopleGateway, 'getAllPeople');
        getAllPlanetsGatewaySpy = sinon.spy(planetGateway, 'getAllPlanets');

        nock('https://swapi.dev')
          .get('/api/people?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse1.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/people?page=2')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse2.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/planets?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/planetsResponse.json`, { 'Content-Type': 'application/json' });

        await planetService.getAll();
        planets = await planetService.getAll();
      });

      it('should call peopleGateway.getAllPeople once', () =>  expect(getAllPeopleGatewaySpy).to.have.been.calledOnce);

      it('should call planetGateway.getAllPlanets once', () =>  expect(getAllPlanetsGatewaySpy).to.have.been.calledOnce);

      it('people response should be correct', () => expect(planets).to.eql(
        JSON.parse(
          fs.readFileSync(`${__dirname}/resources/expectedPlanetsResponse.json`,  'utf8')
        )
      ));
    });
  });
});
