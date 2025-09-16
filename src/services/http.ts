import { getAccessToken } from '@/lib/auth-client';
import { apiUrl } from '@/lib/endpoints';
import { logger } from '@/lib/logger';

import { HttpClient } from './http-client';

export type { HttpMethod, RequestOptions } from './http-client';

export const httpClient = new HttpClient({
  getToken: getAccessToken,
  resolveUrl: apiUrl,
  logger,
});

export const requestJson = httpClient.requestJson;
export const requestVoid = httpClient.requestVoid;
