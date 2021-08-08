const nock = require('nock');
const fs = require('fs');
const sinon = require('sinon');
const { expect } = require('chai');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const peopleService = require('../../src/services/peopleService');
const peopleGateway = require('../../src/gateways/peopleGateway');
const cacheService = require('../../src/services/cacheService');

chai.use(sinonChai);

describe('peopleService Integration tests', () => {
  beforeEach(() => {
    cacheService.flushAll();
    sinon.restore();
  });
  describe('function getAll()', () => {
    context('when calling getAll() for the first time', () => {
      let people;
      let getAllPeopleGatewaySpy;
      before(async () => {
        getAllPeopleGatewaySpy = sinon.spy(peopleGateway, 'getAllPeople');
        nock('https://swapi.dev')
          .get('/api/people?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse1.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/people?page=2')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse2.json`, { 'Content-Type': 'application/json' });
        people = await peopleService.getAll();
      });

      it('should call peopleGateway.getAllPeople once', () =>  expect(getAllPeopleGatewaySpy).to.have.been.calledOnce);

      it('people response should be correct', () => expect(people).to.eql(
        JSON.parse(
          fs.readFileSync(`${__dirname}/resources/expectedPeopleResponse.json`,  'utf8')
        )
      ));
    });

    context('when calling getAll() two times', () => {
      let people;
      let getAllPeopleGatewaySpy;
      before(async () => {
        getAllPeopleGatewaySpy = sinon.spy(peopleGateway, 'getAllPeople');
        nock('https://swapi.dev')
          .get('/api/people?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse1.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/people?page=2')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse2.json`, { 'Content-Type': 'application/json' });
        await peopleService.getAll();

        people = await peopleService.getAll();
      });

      it('should call peopleGateway.getAllPeople once', () =>  expect(getAllPeopleGatewaySpy).to.have.been.calledOnce);

      it('people response should be correct', () => expect(people).to.eql(
        JSON.parse(
          fs.readFileSync(`${__dirname}/resources/expectedPeopleResponse.json`,  'utf8')
        )
      ));
    });

    context('when calling getAll() with sortStrategy=name', () => {
      let people;
      let getAllPeopleGatewaySpy;
      before(async () => {
        getAllPeopleGatewaySpy = sinon.spy(peopleGateway, 'getAllPeople');
        nock('https://swapi.dev')
          .get('/api/people?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse1.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/people?page=2')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse2.json`, { 'Content-Type': 'application/json' });

        people = await peopleService.getAll('name');
      });

      it('should call peopleGateway.getAllPeople once', () =>  expect(getAllPeopleGatewaySpy).to.have.been.calledOnce);

      it('people response should be correct', () => expect(people).to.eql(
        JSON.parse(
          fs.readFileSync(`${__dirname}/resources/expectedPeopleResponseOrderedByName.json`,  'utf8')
        )
      ));
    });

    context('when calling getAll() with sortStrategy=mass', () => {
      let people;
      let getAllPeopleGatewaySpy;
      before(async () => {
        getAllPeopleGatewaySpy = sinon.spy(peopleGateway, 'getAllPeople');
        nock('https://swapi.dev')
          .get('/api/people?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse1.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/people?page=2')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse2.json`, { 'Content-Type': 'application/json' });

        people = await peopleService.getAll('mass');
      });

      it('should call peopleGateway.getAllPeople once', () =>  expect(getAllPeopleGatewaySpy).to.have.been.calledOnce);

      it('people response should be correct', () => expect(people).to.eql(
        JSON.parse(
          fs.readFileSync(`${__dirname}/resources/expectedPeopleResponseOrderedByMass.json`,  'utf8')
        )
      ));
    });

    context('when calling getAll() with sortStrategy=mass', () => {
      let people;
      let getAllPeopleGatewaySpy;
      before(async () => {
        getAllPeopleGatewaySpy = sinon.spy(peopleGateway, 'getAllPeople');
        nock('https://swapi.dev')
          .get('/api/people?page=1')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse1.json`, { 'Content-Type': 'application/json' });

        nock('https://swapi.dev')
          .get('/api/people?page=2')
          .times(1)
          .replyWithFile(200, `${__dirname}/resources/peopleResponse2.json`, { 'Content-Type': 'application/json' });

        people = await peopleService.getAll('height');
      });

      it('should call peopleGateway.getAllPeople once', () =>  expect(getAllPeopleGatewaySpy).to.have.been.calledOnce);

      it('people response should be correct', () => expect(people).to.eql(
        JSON.parse(
          fs.readFileSync(`${__dirname}/resources/expectedPeopleResponseOrderedByHeight.json`,  'utf8')
        )
      ));
    });
  });
});
