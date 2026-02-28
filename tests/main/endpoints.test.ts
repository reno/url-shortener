import request from 'supertest';
import { createApp } from '../../src/main/app';

describe('Endpoints', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp();
  });

  it('test_shortening_url', async () => {
    const longUrl = "https://en.wikipedia.org/wiki/Systems_design";
    const response = await request(app)
      .post('/shorten')
      .send({ longUrl });

    expect(response.status).toBe(200);
    expect(response.body.hash).not.toBeNull();
  });

  it('test_redirect', async () => {
    const longUrl = "https://en.wikipedia.org/wiki/Systems_design";

    const postResponse = await request(app)
      .post('/shorten')
      .send({ longUrl });

    const hash = postResponse.body.hash;
    const getParameter = `/${hash}`;

    const getResponse = await request(app).get(getParameter);

    expect(getResponse.status).toBe(301);
    expect(getResponse.headers['location']).toBe(longUrl);
  });

  it('test_redirect_invalid_hash', async () => {
    const response = await request(app).get('/invalid_hash');
    expect(response.status).toBe(404);
  });
});
