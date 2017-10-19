import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import app from '../src';


describe('requests', () => {
  let server;

  beforeAll(() => {
    jasmine.addMatchers(matchers); // eslint-disable-line no-undef
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('GET 200', async () => {
    const res = await request.agent(server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET 404', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res).toHaveHTTPStatus(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
