import type { Logger } from '@/lib/logger';
import { logger as defaultLogger } from '@/lib/logger';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: unknown;
}

type TokenProvider = () =>
  | string
  | null
  | undefined
  | Promise<string | null | undefined>;
type UrlResolver = (path: string) => string;

interface HttpClientConfig {
  getToken?: TokenProvider;
  resolveUrl: UrlResolver;
  loggerLabel?: string;
  logger?: Logger;
}

export class HttpClient {
  private readonly tokenProvider?: TokenProvider;
  private readonly resolveUrl: UrlResolver;
  private readonly loggerLabel: string;
  private readonly logger: Logger;

  constructor({ getToken, resolveUrl, loggerLabel, logger }: HttpClientConfig) {
    this.tokenProvider = getToken;
    this.resolveUrl = resolveUrl;
    this.loggerLabel = loggerLabel ?? 'HTTP';
    this.logger = logger ?? defaultLogger;
  }

  requestJson = async <T>(
    path: string,
    opts: RequestOptions = {}
  ): Promise<T> => {
    const method = opts.method ?? 'GET';
    const url = this.resolveUrl(path);
    const headers = await this.createBaseHeaders();
    headers.set('Content-Type', 'application/json');
    this.mergeHeaders(headers, opts.headers);

    const res = await fetch(url, {
      method,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store',
    });

    const ct = res.headers.get('content-type') || '';
    const raw = await res.text();
    const maybeJson = ct.includes('application/json');
    let parsed: unknown = undefined;
    if (maybeJson) {
      try {
        parsed = JSON.parse(raw);
      } catch {}
    }

    if (!res.ok) {
      const message = this.extractApiMessage(parsed, raw);
      this.log(
        `[${this.loggerLabel} ${method}] ${path} -> ${res.status}: ${message}`
      );
      throw new Error(message);
    }

    if (!maybeJson) {
      this.log(
        `[${this.loggerLabel}] ${path} -> Non-JSON content-type: ${ct}; preview:`,
        raw.slice(0, 200)
      );
      throw new Error('Non-JSON response');
    }

    if (parsed === undefined) {
      this.log(
        `[${this.loggerLabel}] ${path} -> Invalid JSON; preview:`,
        raw.slice(0, 200)
      );
      throw new Error('Invalid JSON response');
    }

    return parsed as T;
  };

  requestVoid = async (
    path: string,
    opts: RequestOptions = {}
  ): Promise<void> => {
    const method = opts.method ?? 'DELETE';
    const url = this.resolveUrl(path);
    const headers = await this.createBaseHeaders();
    this.mergeHeaders(headers, opts.headers);

    const res = await fetch(url, {
      method,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store',
    });

    if (!res.ok) {
      const ct = res.headers.get('content-type') || '';
      const raw = await res.text();
      let parsed: unknown = undefined;
      if (ct.includes('application/json')) {
        try {
          parsed = JSON.parse(raw);
        } catch {}
      }

      const message = this.extractApiMessage(parsed, raw);
      this.log(
        `[${this.loggerLabel} ${method}] ${path} -> ${res.status}: ${message}`
      );
      throw new Error(message);
    }
  };

  private async createBaseHeaders(): Promise<Headers> {
    const headers = new Headers({ Accept: 'application/json' });
    const token = this.tokenProvider ? await this.tokenProvider() : undefined;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private mergeHeaders(base: Headers, extra?: HeadersInit): Headers {
    if (!extra) return base;
    if (extra instanceof Headers) {
      extra.forEach((v, k) => base.set(k, v));
    } else if (Array.isArray(extra)) {
      extra.forEach(([k, v]) => base.set(k, v));
    } else {
      Object.entries(extra).forEach(([k, v]) => base.set(k, String(v)));
    }
    return base;
  }

  private extractApiMessage(payload: unknown, fallback: string): string {
    if (payload && typeof payload === 'object') {
      if (
        'message' in payload &&
        typeof (payload as { message?: unknown }).message === 'string'
      ) {
        return (payload as { message?: string }).message as string;
      }
      if (
        'error' in payload &&
        typeof (payload as { error?: unknown }).error === 'string'
      ) {
        return (payload as { error?: string }).error as string;
      }
    }
    return fallback;
  }

  private log(message?: unknown, ...optionalParams: unknown[]) {
    this.logger.warn(message, ...optionalParams);
  }
}
