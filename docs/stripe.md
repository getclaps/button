---
layout: legal
---

# Redirecting…
Your checkout session has been created.
Taking you to *Stripe Checkout* shortly.

<dl>
  <dt>Session ID</dt>
  <dd id="session-id"></dd>
</dl>

<script src="https://js.stripe.com/v3/"></script>
<script>
  const sessionId = document.getElementById('session-id').innerText;
  if (sessionId) {
    window.setTimeout(function() {
      var stripe = Stripe('pk_test_RqlBfBtNXivTjXiQXRtcDzd1');
      stripe.redirectToCheckout({ sessionId:  });
    }, 1000);
  }
</script>