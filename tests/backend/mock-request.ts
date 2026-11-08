import { NextRequest } from 'next/server';

export const createMockNextRequest = (
  url: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
  } = {}
): NextRequest => {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers || {});

  if (options.body && typeof options.body === 'object' && !(options.body instanceof String)) {
    if (!headers.get('content-type')) {
      headers.set('content-type', 'application/json');
    }
  }

  if (options.cookies) {
    const cookieHeader = Object.entries(options.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
    headers.set('cookie', cookieHeader);
  }

  const reqInit: RequestInit = {
    method,
    headers,
  };

  if (options.body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    reqInit.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  return new NextRequest(new Request(url, reqInit));
};

