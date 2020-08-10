---
layout: welcome
selected_posts:
  - _posts/2020-06-01-improve-seo-ranking.md
  - _posts/2020-06-02-gdpr-compliant-analytics.md
---

# Clap Button

<applause-button id="app-button"></applause-button>

A zero-config clap button that combines analytics   
with Cookie Clicker-levels of engagement[^1].
{:.lead.centered}

<form method="POST" action="http://localhost:8787/stripe/forward" class="centered mb4">
  <input type="hidden" name="mode" value="subscription"/>
  <input type="hidden" name="payment_method_types[0]" value="card"/>
  <input type="hidden" name="line_items[0][quantity]" value="1"/>
  <input type="hidden" name="line_items[0][price]" value="price_1HBfyyAKMWLvHNfJHO3TVUYM"/>
  <input type="hidden" name="success_url" value="http://localhost:8787/dashboard?session_id={CHECKOUT_SESSION_ID}"/>
  <input type="hidden" name="cancel_url" value="{{ site.url }}{{ site.baseurl }}/"/>
  <button type="submit" class="btn btn-primary">Subscribe</button>
</form>

<!-- * Table of Contents
{:toc .large-only} -->

***

## Improve SEO Ranking
{:.mt4}

Clap Button improves your SEO ranking by keeping users engaged on your site. 
The component is designed to draw attention and keeps visitors engaged with it's Cookie Clicker[^1]-like mechanics.

<applause-button url="#improve-seo-ranking" nowave></applause-button>

## GDPR-Compliant Analytics
{:.mt4}
Clap Button doubles as a GDPR-compliant analytics solution. 
It keeps track of which pages get visits and from which countries.

Unlike other solutions, clap button also gives you Claps, 
which is an anoymised, self-selected score of which pages users _love_.

<applause-button url="#gdpr-compliant-analytics" nowave></applause-button>

## Built-In Spam Protection
{:.mt4}
Clap button uses a simple _Proof of Work_ algorithm to add an additional barrier to automated scripts attempting to manipulate your clap scores.

<applause-button url="#built-in-spam-protection" nowave></applause-button>

## Living on the Edge
{:.mt4}
Clap button is built on fully managed, globally distributed infrastructure ("serverless"). 
Response times are fast and it scales automatically to any load. 

The pricing is simply a function of serverless costs + a our markup fee.

<applause-button url="#living-on-the-edge" nowave></applause-button>

## Minimal example
{:.mt6}
{:.centered}

The applause button is a custom element that can be added directly to the page. Here is a minimal example:

```html
<head>
  <script type="module" src="https://unpkg.com/clap-button/dist/clap-button.js"></script>
</head>
<body>
  <!-- Zero Configuration! -->
  <applause-button></applause-button>
</body>
```
{:.larger}

<applause-button url="#minimal-example" nowave></applause-button>

<!-- [Subscribe](#){:.btn.btn-primary.subscribe} -->



The above will render an applause button, persisting claps and clap counts. 


For more information, visit the [project website](https://colineberhardt.github.io/applause-button/);


[^1]: [Cookie Clicker](http://orteil.dashnet.org/cookieclicker/) is a popular online game that pioneered the "clicker" genre, where the main mechanic is clicking a single button. Much like clap buttons, it's using the fact that clicking something repeatedly is oddly satisfying.

<style>
/* .page > header > h1, */
.page > header > h1 + .hr { 
  display: none; 
}

.mt6 { margin-top: 6rem }

.page { position: relative }
applause-button[url^="#"] {
  margin: 0;
  width: 3rem;
  height: 3rem;
  position: absolute;
  right: -7.5rem;
  margin-top: -3rem;
  font-size: smaller;
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
h2, h3, h4, h5, h6 { text-align: center; }

</style>
<script>
  document.querySelector('.page > header').prepend(document.querySelector('#app-button'));
</script>
