import AbortController from 'abort-controller';
import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';

interface FetchRetryRequestInit extends RequestInit {
  retries: number;
  timeout?: number;
}

export default async function fetchRetry(
  input: RequestInfo,
  { retries = 1, timeout = 5000 }: FetchRetryRequestInit
): Promise<Response> {
  let response: Response | undefined;

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    response = await fetch(input, { signal: controller.signal });

    if (response.ok) {
      return response;
    } else {
      throw new Error(
        `${response.status} ${response.statusText}: ${response.url}`
      );
    }
  } catch (err) {
    if (retries > 0) {
      return fetchRetry(input, { retries: retries - 1, timeout });
    } else {
      if (err.type === 'aborted') {
        throw new Error('Request timed out');
      }

      throw err;
    }
  } finally {
    clearTimeout(timer);
  }
}
