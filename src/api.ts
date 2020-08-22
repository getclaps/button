import { UUID } from 'uuid-class';

import { ParamsURL, jsonFetch } from './json-request';
import { proofOfClap } from './util.js';

const API = Reflect.get(window, 'GET_CLAPS_API') || "https://worker.getclaps.dev";

type HrefIndex = { [href: string]: { claps: number } };

const fetchMap = new Map<string, Promise<HrefIndex>>();
let referrerSent = false;

export const getClaps = async (href: string, parentHref: string, referrer: string): Promise<{ claps: number }> => {
  let indexPromise = fetchMap.get(parentHref);
  if (!indexPromise) {
    fetchMap.set(parentHref, indexPromise = fetchMap.get(parentHref) || (async () => {
      const response = await jsonFetch(new ParamsURL('/views', { 
        href: parentHref, 
        ...referrer && !referrerSent ? { referrer } : {} 
      }, API), { 
        method: 'POST',
        body: null,
        mode: 'cors',
        credentials: 'include',
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
  const responseP = jsonFetch(new ParamsURL('/claps', { href }, API), {
    method: 'POST',
    body: { claps, id, nonce },
    mode: 'cors',
    credentials: 'include',
  });
  const response = await responseP;
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
