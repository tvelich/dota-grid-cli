import * as fetch from 'node-fetch';

import fetchRetry from './fetch-retry';

describe('fetch-retry.test.ts', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(fetch, 'default');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should retry a request', async () => {
    fetchSpy.mockImplementationOnce(() => {
      throw new Error('whoops');
    });

    fetchSpy.mockImplementationOnce(() => {
      throw new Error('whoops again');
    });

    fetchSpy.mockImplementationOnce(() => ({
      ok: true,
      response: 'yay',
    }));

    const response = await fetchRetry('https://google.com', { retries: 2 });

    expect(fetchSpy).toBeCalledTimes(3);
    expect(response).toEqual({
      ok: true,
      response: 'yay',
    });
  });

  it('should error a request after retries exceeded', async () => {
    fetchSpy.mockImplementation(() => {
      throw new Error('whoops');
    });

    await expect(
      fetchRetry('https://google.com', { retries: 2 })
    ).rejects.toThrowError('whoops');
    expect(fetchSpy).toBeCalledTimes(3);
  });

  it('should wait before retrying', async () => {
    fetchSpy.mockImplementationOnce(() => {
      return new Promise((_, reject) => {
        setTimeout(() => reject('whoops'), 200);
      });
    });

    fetchSpy.mockImplementationOnce(() => ({
      ok: true,
      response: 'yay',
    }));

    const startTime = performance.now();
    await fetchRetry('https://google.com', { retries: 1 });
    const endTime = performance.now();

    const callDuration = endTime - startTime;

    expect(callDuration).toBeGreaterThanOrEqual(200);
    expect(fetchSpy).toBeCalledTimes(2);
  });
});
