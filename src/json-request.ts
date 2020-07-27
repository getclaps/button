export const urlWithParams = (url: string, params?: object) => {
  const u = new URL(url, self.location.origin);
  if (params) {
    // @ts-ignore
    u.search = new URLSearchParams([...u.searchParams, ...Object.entries(params)]).toString();
  }
  return u.href;
}

export class JSONRequest extends Request {
  constructor(input: RequestInfo, init?: Omit<RequestInit, 'body'> & { body?: any }, replacer?: (this: any, key: string, value: any) => any, space?: string | number) {
    const { headers: h, body: b, ...rest } = init || {};

    const body = b ? JSON.stringify(b, replacer, space) : null;

    const headers = new Headers(h);
    headers.set('Accept', 'application/json, text/plain, */*');
    if (body) headers.set('Content-Type', 'application/json;charset=UTF-8');

    super(input, { headers, body, ...rest });
  }
}
