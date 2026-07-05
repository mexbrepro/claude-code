# Fusione d'Orta — landing page

One HTML file, no build step, no framework. Open `index.html` in any text
editor, change the text, upload. That's the whole deploy process.

## Files

- `index.html` — the entire site (markup, CSS, JS, all inline)
- `images/` — drop real photos here (see `images/README.md` for exact filenames)
- `robots.txt`, `sitemap.xml` — copy to the site root alongside `index.html`

## Before going live, fill in

Search `index.html` for `EDIT:` comments — every one marks something that
still needs a real value:

1. **Dates** — "August 23–28, 2026" appears in the hero, the closing line,
   the meta description, and the JSON-LD `startDate`/`endDate`. Update all of
   them together.
2. **Prices** — four `.price-card` blocks under `id="join"`, plus the
   matching `price` fields in the `Event` JSON-LD at the top of `<head>`.
3. **Stripe Payment Links** — each `.price-card` has a
   `data-stripe="https://buy.stripe.com/REPLACE_..."` attribute. Replace with
   the real link for that contribution level.
4. **Sold out / waiting list** — if a category sells out, set that card's
   `data-sold-out="true"`. The button automatically switches to "Join the
   waiting list" and opens a pre-filled email instead of Stripe. No other
   change needed.
5. **Contact email** — currently `hello@fusionedorta.it`, used in a few
   `mailto:` links.
6. **Address / geo coordinates** — the `Event` JSON-LD has a placeholder
   `PostalAddress` and `GeoCoordinates` for Centro d'Ompio; confirm the exact
   values.
7. **Images** — see `images/README.md`. Until real photos are added, each
   spot shows a labeled placeholder tile instead of a broken image icon, so
   it's safe to launch a draft before all quantity of photos are ready.
8. **Footer legal links** ("Imprint", "Privacy Policy", "Organizer") are
   currently `href="#"` — point them at real pages once they exist.

## Checking it

- Open `index.html` directly in a browser — everything works with no server.
- Google's Rich Results Test (`search.google.com/test/rich-results`) against
  the live URL will confirm the `Event` + `FAQPage` schema once deployed.
- Run Lighthouse in Chrome DevTools; keep the hero image compressed (see
  `images/README.md`) to hold LCP under 2.5s.
