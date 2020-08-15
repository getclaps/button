---
layout: welcome
worker_domain: http://localhost:8787
worker_domain_dev: http://localhost:8787
price_id: price_1HF9nBAKMWLvHNfJlxejlWKp
---

# Clap Button

<clap-button id="app-button"></clap-button>

A zero-config Clap Button that combines Analytics   
with Cookie Clicker-like Engagement. [Learn More](#cookie-clicker-like-engagement){:.smaller}.
{:.lead.centered}

{% include form.html %}

<!-- * Table of Contents
{:toc .large-only} -->

***

## Cookie Clicker-like Engagement
{:.mt4}

<clap-button url="#improve-seo-ranking" text-placement="bottom" nowave></clap-button>

Clap Button improves your SEO ranking by keeping users engaged on your site. 

The component is designed to draw attention and keeps visitors active with it's Cookie Clicker[^1]-like mechanics,
which are exploiting the fact that clicking something repeatedly is oddly satisfying.


## Privacy-Preserving Analytics
{:.mt4}

<clap-button url="#gdpr-compliant-analytics" text-placement="bottom" nowave></clap-button>

Clap Button doubles as a privacy-friendly analytics solution. 
It track pages, not people.

Unlike other analytics solutions, Clap Button also gives you insights along a second dimension: 
Claps, an anonymous, self-selected score of which parts users _love_.


<!-- ## Built-In Spam Protection
{:.mt4}

<clap-button url="#built-in-spam-protection" text-placement="bottom" nowave></clap-button>

Clap button uses a simple _Proof of Work_ algorithm to add an additional barrier to automated scripts attempting to manipulate your clap scores. -->


## Living on the Edge
{:.mt4}

<clap-button url="#living-on-the-edge" text-placement="bottom" nowave></clap-button>

Clap Button is built on fully managed, globally distributed infrastructure. 
Response times are fast and it scales automatically to any load. 

***
{:.mt4}

## Zero-Config Example
{:.mt6}

<clap-button url="#zero-config-example" text-placement="bottom" nowave></clap-button>

The clap button is a custom element that can be added directly to the page. Here is a minimal example:

The example only works if your site is hosted on __localhost__ or with an [active subscription](#pricing) otherwise.
{:.note.smaller.mb2}

```html
<head>
  <script type="module" src="https://unpkg.com/clap-button"></script>
</head>
<body>
  <clap-button></clap-button>
</body>
```
{:.larger}

This will render the following button:

<clap-button></clap-button>

## Pricing
The Clap Button backend service is __$5.00 per month__ per origin for early-adopters. 
Currently, this is limited to 100,000 views per month. If you need more [please contact me](mailto:claps@qwtel.com) with details.

After you've completed the the payment, you'll be taken to your dashboard, where you'll be able to enter your domain. 
After this step, `<clap-button/>` will work immediately on your site. 

_Note that the Clap Button Dashboard is work in progress._
_All the relevant information is there, and you can cancel your subscription if it is not up to your standards._
_However it doesn't look very nice and interactivity is limited right now._
{:.note title="Important"} 

{% include form.html btn_size="btn-lg" %}


## Limitations

Currently, usage it limited to smaller to medium-sized websites. 
The infrastructure supports much higher volumes, but metering is not implemented yet. 
[Please contact me](mailto:claps@qwtel.com) if that's something you're interested in.

<!-- Don't feel like typing an email to a human? [Subscribe to our newsletter](#subscribe) instead and get informed when high-volume plans arrive.
{:.note.smaller.mb2 title="Hey there!"} -->

Claps per month
: 1,000,000

Views per month
: 100,000

Clap requests per month
: 100,000

Domains per subscription (e.g. `https://my.domain.com`)
: 1

URLs per domain
: ∞

Fragments per URL (e.g. `/path#fragment`)
: 64



<!-- ## Config Example
{:.mt4}

Zero-Config doesn't mean no config is possible: Make it your own with the following options:

```html
<clap-button 
  url="#config-example" 
  text-placement="bottom" 
  style="--clap-button-color: gray"
  nowave 
></clap-button>
```
{:.larger}

<clap-button url="#config-example" text-placement="bottom" nowave style="--clap-button-color: gray"></clap-button> -->



[^1]: [Cookie Clicker](http://orteil.dashnet.org/cookieclicker/) is a popular online game that pioneered the "clicker" genre, where the main mechanic is clicking a single button. Much like clap buttons, it's using the fact that clicking something repeatedly is oddly satisfying.

[^2]: Note that claps will be deleted after 24 hours when they are hosted on localhost.


<style>
/* .page > header > h1, */
.page > header > h1 + .hr { 
  display: none; 
}

.mt6 { margin-top: 6rem }
.mb2 { margin-bottom: 1.5rem }

.page { position: relative }
clap-button {
  --clap-button-color: var(--accent-color);
}
h2 + clap-button[url^="#"] {
  margin: 0;
  width: 3rem;
  height: 3rem;
  position: absolute;
  left: -5rem;
  margin-top: -3rem;
  font-size: smaller;
  color: var(--gray-text);
  --clap-button-color: var(--menu-text);
}

.page > header > h1 { 
  width: 100%!important;
  font-size: 5rem;
  text-align: center;
  width: 100%!important;
}

#app-button {
  width:10rem;
  height:10rem;
  margin: 5rem auto;
  font-size: 1.5rem;
}

.larger { font-size: larger; }
.smaller { font-size: smaller; }
/* h2, h3, h4, h5, h6 { text-align: center; } */

</style>
<script>
  document.querySelector('.page > header').prepend(document.querySelector('#app-button'));
</script>
