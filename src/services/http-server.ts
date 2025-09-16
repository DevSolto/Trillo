import { getServerAccessToken } from '@/lib/auth-server';
import { apiUrl, API_BASE_URL } from '@/lib/endpoints';
import { logger } from '@/lib/logger';

import { HttpClient } from './http-client';

export type { HttpMethod, RequestOptions } from './http-client';

const resolveServerUrl = (path: string): string => {
  if (path.startsWith('/api/')) {
    return new URL(path.replace(/^\/api\//, ''), API_BASE_URL).toString();
  }
  return apiUrl(path);
};

export const httpServerClient = new HttpClient({
  getToken: getServerAccessToken,
  resolveUrl: resolveServerUrl,
  loggerLabel: 'HTTP(S)',
  logger,
});

export const requestJsonServer = httpServerClient.requestJson;
export const requestVoidServer = httpServerClient.requestVoid;
