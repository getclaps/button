import 'broadcastchannel-polyfill';
import 'fast-text-encoding';

import { StorageArea } from 'kv-storage-polyfill';
import { html, svg, LitElement, customElement, query, property } from "lit-element";
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { repeat } from 'lit-html/directives/repeat';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { styles } from './styles';

import { getClaps, updateClapsApi, mine, cleanUp } from './api';
import { ConnectedCountElement } from "./connected-count";

enum TextPlacement {
  Top = "top",
  Bottom = "bottom",
}

enum ErrorTypes {
  PaymentRequired = 1,
  CryptoRequired,
  Generic,
}

interface ClapData {
  btnId: number,
  href: string;
  claps: number;
  totalClaps: number;
}

const WEBSITE = "https://getclaps.dev";
const TIMER = 3000;
const ANIM_DELAY = 250;

const storage = new StorageArea('clap-button');

const arrayOfSize = (size: number) => [...new Array(size).keys()]

const formatClaps = (claps: number | null) => claps != null ? claps.toLocaleString('en') : '';

// toggle a CSS class to re-trigger animations
const toggleClass = (element: HTMLElement, ...cls: string[]) => {
  element.classList.remove(...cls);

  // Force layout reflow
  void element.offsetWidth;

  element.classList.add(...cls);
};

const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const getParentHref = (href: string) => {
  const parentURL = new URL(href);
  parentURL.hash = '';
  parentURL.search = '';
  return parentURL.href;
}

@customElement('clap-config')
export class ClapConfig extends LitElement { }

@customElement('clap-text')
export class ClapText extends LitElement {
  @property({ type: Number, reflect: true }) at: number = 1;
}

@customElement('clap-button')
export class ClapButton extends ConnectedCountElement {
  static styles = styles;

  private static intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(x => (x.target as ClapButton).isIntersecting = x.isIntersecting);
  });

  @query('.style-root') private styleRoot!: HTMLElement;

  @property({ type: String, reflect: true, attribute: 'text-placement' }) textPlacement: TextPlacement = TextPlacement.Bottom;
  @property({ type: Boolean, reflect: true }) noWave: boolean = false;
  @property({ type: Boolean, reflect: true }) messages: boolean = false;
  @property({ type: String, reflect: false }) href!: string;
  @property({ type: String, reflect: false }) url!: string;

  @property() private uiClaps: number = 0;
  @property() private bufferedClaps: number = 0;
  @property() private loading: boolean = false;
  @property() private clapped: boolean = false;
  @property() private clicking: boolean = false;
  @property() private ready: boolean = false;
  @property() private error: ErrorTypes | null = null;
  @property() private isIntersecting: boolean = false;

  #canonical?: string;
  get canonical() {
    return this.#canonical || (() => {
      const href = this.href || this.url || '';
      const canonicalEl = this.ownerDocument.head.querySelector('link[rel=canonical]') as HTMLLinkElement;
      const location = canonicalEl != null ? new URL(canonicalEl.href) : this.ownerDocument.location;
      return this.#canonical = new URL(href, location.href).href;
    })();
  }

  #parentHref?: string;
  get parentHref() {
    return this.#parentHref || (() => {
      return this.#parentHref = getParentHref(this.canonical);
    })();
  }

  get referrer() {
    const usp = new URLSearchParams(this.ownerDocument.location.search);
    return usp.get('referrer') || usp.get('referer') || this.ownerDocument.referrer;
  }

  #messages!: Map<number, string>;
  #channel = new BroadcastChannel('clap-button');
  #btnId = Math.trunc(Math.random() * 1_000_000_000);

  connectedCallback() {
    super.connectedCallback();

    if ('crypto' in window && 'subtle' in window.crypto && 'digest' in window.crypto.subtle) { /* ok */ } else {
      this.error = ErrorTypes.CryptoRequired;
      return;
    }

    this.#channel.addEventListener('message', this.#clappedCallback);

    ClapButton.intersectionObserver.observe(this);

    // const themeColorEl = document.head.querySelector('meta[name=theme-color]') as HTMLMetaElement | null;
    // if (themeColorEl) {
    //   this.el.style.setProperty('--theme-color', themeColorEl.content);
    // }

    const clapTexts: ClapText[] = Array.from(this.ownerDocument.querySelector('clap-config')?.querySelectorAll('clap-text') ?? []);
    this.#messages = new Map(clapTexts?.map((x => [x.at, x.innerHTML] as const)).sort(([a], [b]) => b - a));

    ;(async () => {
      this.loading = true;
      this.clapped = await storage.get(this.canonical) != null;

      try {
        const { claps } = await getClaps(this.canonical, this.parentHref, this.referrer);
        this.loading = false;
        this.ready = true;
        this.uiClaps = claps;
      } catch (err) {
        this.loading = false;
        this.ready = false;
        this.error = err.status === 402 ? ErrorTypes.PaymentRequired : ErrorTypes.Generic;
      }
    })();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ClapButton.intersectionObserver.unobserve(this);
    this.#channel.removeEventListener('message', this.#clappedCallback)
  }

  // Ref-counts all elements with the same `parentHref` and invokes `allDisconnectedCallback` when the count reaches 0.
  get connectedCountKey() { return this.parentHref }
  protected allDisconnectedCallback() {
    cleanUp(this.parentHref);
  }

  render() {
    const hand = svg`
      <svg viewBox="0 0 60 60" aria-label="clap" id="hand-svg"><g fill-rule="evenodd"><path d="M11.74 0l.76 2.97.76-2.97zM16.63 1.22L15.2.75l-.4 3.03zM9.79.75l-1.43.47 1.84 2.56zM22.47 13.3L19.45 8c-.29-.43-.69-.7-1.12-.78a1.16 1.16 0 0 0-.91.22c-.3.23-.48.52-.54.84l.05.07 2.85 5c1.95 3.56 1.32 6.97-1.85 10.14a8.46 8.46 0 0 1-.55.5 5.75 5.75 0 0 0 3.36-1.76c3.26-3.27 3.04-6.75 1.73-8.91M12.58 9.89c-.16-.83.1-1.57.7-2.15l-2.5-2.49c-.5-.5-1.38-.5-1.88 0-.18.18-.27.4-.33.63l4.01 4z"></path><path d="M15.81 9.04a1.37 1.37 0 0 0-.88-.6.81.81 0 0 0-.64.15c-.18.13-.72.55-.24 1.56l1.43 3.03a.54.54 0 1 1-.87.61L7.2 6.38a.99.99 0 1 0-1.4 1.4l4.4 4.4a.54.54 0 1 1-.76.76l-4.4-4.4L3.8 7.3a.99.99 0 0 0-1.4 0 .98.98 0 0 0 0 1.39l1.25 1.24 4.4 4.4a.54.54 0 0 1 0 .76.54.54 0 0 1-.76 0l-4.4-4.4a1 1 0 0 0-1.4 0 .98.98 0 0 0 0 1.4l1.86 1.85 2.76 2.77a.54.54 0 0 1-.76.76L2.58 14.7a.98.98 0 0 0-1.4 0 .99.99 0 0 0 0 1.4l5.33 5.32c3.37 3.37 6.64 4.98 10.49 1.12 2.74-2.74 3.27-5.54 1.62-8.56l-2.8-4.94z"></path></g></svg>`;

    const circle = svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" id="countdown-svg">
      <g class="countdown">
        <circle cx="50" cy="50" r="49"/>
      </g>
    </svg>
    `;

    const x = this.bufferedClaps;
    const n = 5 + x;
    const BASE_MAX_DELAY = 300;
    const maxDelay = BASE_MAX_DELAY * (1 - Math.E ** (-x / 15));
    const sparkle = svg`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 20 20">
        <g class="sparkle">
          ${repeat(arrayOfSize(n), i => i, i => svg`<g style=${styleMap({ transform: `rotate(${Math.floor(360 / n * i)}deg) translateX(10px)` })}>
            <circle style=${styleMap({ animationDelay: `${Math.floor(Math.random() * maxDelay)}ms` })} cx="0" cy="0" r="1"/>
          </g>`)}
        </g>
      </svg>`;

    return html`
      <div 
        class=${classMap({
      'style-root': true,
      'loading': this.loading,
      'clapped': this.clapped,
      'no-shockwave': this.noWave || !this.ready,
      'no-animation': !this.isIntersecting,
    })}
        style=${styleMap({
      ...this.error != null ? { '--clap-button-color': 'indianred' } : {}
    })}
      >
        <div class="shockwave"></div>
        <div class=${classMap({
      'count-container': true,
      'container-top': this.textPlacement === TextPlacement.Top,
      'container-bottom': this.textPlacement === TextPlacement.Bottom,
    })}>
          <div class="count">
            ${this.clicking ? '+' : ''}${this.ready ? formatClaps(this.uiClaps) : ''}
            ${this.error === ErrorTypes.PaymentRequired ? html`<a class="error" href="${WEBSITE}">Payment required</a>` : null}
            ${this.error === ErrorTypes.CryptoRequired ? html`<span class="error">Crypto required</span>` : null}
            ${this.error === ErrorTypes.Generic ? html`<span class="error">Error</span>` : null}
          </div>
        </div>
        <div class=${classMap({
      'count-container': true,
      'container-top': this.textPlacement === TextPlacement.Bottom,
      'container-bottom': this.textPlacement === TextPlacement.Top,
    })}>
          ${this.messages ? html`<div style="font-size:smaller">
            ${this.clicking ? unsafeHTML([...this.#messages].find(([x]) => this.uiClaps >= x)?.[1] ?? '') : ''}
          </div>` : null}
        </div>
        ${hand}
        ${sparkle}
        ${circle}
        <button
          ?disabled=${this.loading || !this.ready}
          @mousedown=${this.loading || !this.ready ? null : this.#clickCallback}
          @touchstart=${this.loading || !this.ready ? null : this.#clickCallback}
        ></button>
      </div>
      `;
  }

  #clickCallback = (event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    this.clapped = true;
    this.clicking = true;
    this.bufferedClaps++;

    toggleClass(this.styleRoot, "clap", "ticking");

    this.#updateClaps();

    this.uiClaps = this.bufferedClaps;
  }

  #updateClaps = debounce(async () => {
    const claps = this.bufferedClaps;
    this.bufferedClaps = 0;
    this.loading = true;
    const { href, id, nonce } = await mine(claps, this.canonical);
    const { claps: totalClaps } = await updateClapsApi(claps, href, this.parentHref, id, nonce);

    this.loading = false;
    this.clicking = false;
    this.styleRoot.classList.remove('ticking');
    toggleClass(this.styleRoot, "clap");

    this.#channel.postMessage({ btnId: this.#btnId, claps, totalClaps, href });

    // MAYBE: Replace with animation finish event!?
    setTimeout(() => { this.uiClaps = totalClaps }, ANIM_DELAY);

    const data = await storage.get(href) ?? { claps: 0 };
    await storage.set(href, { ...data, claps: data.claps + claps });
  }, TIMER);

  #clappedCallback = ({ data: { href, claps, btnId } }: MessageEvent<ClapData>) => {
    if (btnId !== this.#btnId && [href, getParentHref(href)].includes(this.canonical)) {
      this.clapped = true;
      this.uiClaps += claps;
      toggleClass(this.styleRoot, "clap");
    }
  }
}
