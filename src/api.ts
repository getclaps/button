import { UUID } from 'uuid-class';
import { proofOfClap } from '@getclaps/proof-of-clap';

const API = Reflect.get(window, 'GET_CLAPS_API') || "https://worker.getclaps.dev";

type HrefIndex = { [href: string]: { claps: number } };

function paramsURL(url: string, params?: Record<string, string> | null, base?: string | URL) {
  const u = new URL(url, base);
  for (const [k, v] of Object.entries(params || {})) u.searchParams.append(k, v);
  return u.href;
}

const fetchMap = new Map<string, Promise<HrefIndex>>();
let referrerSent = false;

export const getClaps = async (href: string, parentHref: string, referrer: string): Promise<{ claps: number }> => {
  let indexPromise = fetchMap.get(parentHref);
  if (!indexPromise) {
    fetchMap.set(parentHref, indexPromise = fetchMap.get(parentHref) || (async () => {
      const url = paramsURL('/views', {
        href: parentHref,
        ...referrer && !referrerSent ? { referrer } : {}
      }, API);

      const response = await fetch(url, {
        method: 'POST',
        body: null,
        mode: 'cors',
        credentials: 'include',
        headers: { 'accept': 'application/json' },
      });

      referrerSent = true;

      if (response.ok && response.headers.get('Content-Type')?.includes('json')) {
        return await response.json();
      } else if (response.status === 404) {
        return {};
      } else if (response.status === 402) {
        throw response;
      } else {
        fetchMap.delete(parentHref);
        throw Error();
      }
    })());
  }

  const index: HrefIndex = await indexPromise;
  return index[href] || { claps: 0 }
}

export const mine = async (claps: number, href: string) => {
  const url = new URL(href);
  url.search = '';

  const id = new UUID();
  const nonce = await proofOfClap({ url, claps, id });

  return { href: url.href, id, nonce };
}

export const updateClapsApi = async (claps: number, href: string, parentHref: string, id: UUID, nonce: number): Promise<{ claps: number }> => {
  const url = paramsURL('/claps', { href }, API)
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ claps, id, nonce }),
    mode: 'cors',
    credentials: 'include',
    headers: { 
      'accept': 'application/json', 
      'content-type': 'application/json;charset=UTF-8',
    },
  });
  if (response.ok && response.headers.get('Content-Type')?.includes('json')) {
    fetchMap.delete(parentHref); // TODO: update in place instead?
    return response.clone().json();
  } else {
    throw Error();
  }
};

export const cleanUp = (parentHref: string) => {
  fetchMap.delete(parentHref);
}
