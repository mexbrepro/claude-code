# Fusione d'Orta 2028 — Planning Notes

Draft planning document for the 2028 edition, written ~2 years out. The
landing page itself (`index.html`) still targets **2026** — do not change
its dates until the items in "Open variables" below are settled. This file
is the place to work those out first.

## Open variables (fill in as they're confirmed)

| Variable | 2026 value (current site) | 2028 value |
|---|---|---|
| Dates | August 23–28, 2026 | *TBD — confirm with Centro d'Ompio* |
| Seedling price | 490 € | *TBD* |
| Growing price | 710 € | *TBD* |
| Flourishing price | 980 € | *TBD* |
| Prospering price | 1570 € | *TBD* |
| Stripe Payment Links | placeholders (`REPLACE_*`) | *new links once pricing is set* |
| Hero / gallery photos | placeholder tiles | *TBD — see "Photos" below* |
| Closing group photo | placeholder | *should be from the 2026 or 2027 edition, not older* |

## Why photos are still a placeholder

The landing page pulls its visual identity from real photos of the retreat,
but I couldn't retrieve any from fusionedorta.it — this session's network
policy explicitly blocks outbound connections to that domain. That's a
standing restriction, not a one-off failure, so it won't resolve itself on
a retry.

Two ways forward:
1. **Send the photos directly** (upload here, or share a Drive/Dropbox
   link) and I'll drop them into `images/` using the filenames in
   `images/README.md`.
2. **Shoot the 2026 edition.** Since the closing section specifically wants
   *last year's* group photo, and the other sections want photos that read
   as current rather than archival, the 2026 retreat itself is the natural
   source for 2028's imagery — breathwork sessions, the pool, the terrace,
   cooking, the closing group shot. Worth assigning someone to photograph
   deliberately with this list in mind (see `images/README.md` for the
   exact 15 shots and aspect ratios needed).

## Suggested milestone timeline (T = arrival date)

This assumes a similar shape to the 2026 edition — one venue, one week,
four contribution tiers, Stripe-only registration. Adjust the offsets if
Fusione d'Orta's actual planning cadence runs differently.

| When | Milestone |
|---|---|
| T − 24 months | Confirm dates and availability with Centro d'Ompio; block the venue |
| T − 20 months | Confirm core facilitator team (breathwork, ceremony, movement) |
| T − 18 months | Rough program shape agreed (mornings/afternoons/evenings — see `index.html` §4 "A day at Fusione" for the current rhythm to keep or revise) |
| T − 12 months | Set 2028 pricing for all four tiers; decide if the Seedling/Prospering ratio needs adjusting based on 2026/2027 uptake |
| T − 11 months | Create the four Stripe Payment Links; update `data-stripe` attributes and the JSON-LD `offers` block in `index.html` |
| T − 10 months | Photograph the 2026/2027 edition with the 2028 shot list in mind |
| T − 9 months | Update `index.html`: dates (hero, closing, meta description, JSON-LD `startDate`/`endDate`), prices, images |
| T − 9 months | Site live, registration opens |
| T − 6 months | Review uptake per tier; if a tier is close to full, prepare the `data-sold-out="true"` / waiting-list switch |
| T − 2 months | Cancellation-policy cutoff for full refunds (currently 60 days — confirm this still holds) |
| T − 1 month | Final headcount to the Centro d'Ompio kitchen; arrival logistics (shuttle, packing list) sent to registered guests |
| T | Retreat runs |
| T + 2 weeks | Photograph/collect content for the *next* edition's landing page |

## Pricing note

If contribution levels simply track inflation rather than being
re-thought, two years at ~3%/year works out to roughly +6% over the 2026
figures — e.g. Seedling 490 € → ~520 €. Treat this as a starting point for
discussion, not a decision; the actual number should reflect Centro
d'Ompio's real cost changes and how full each tier ran in 2026/2027.

## When the 2028 values are ready

Come back to this file, fill in the right-hand column of the table above,
then update `index.html` directly — every spot that needs to change is
marked `EDIT:` (search for it). The `README.md` in this folder has the
full checklist.
