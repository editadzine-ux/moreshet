# Education exhibition extension — 2 November 2026

This records the finished education-only revision in `מרכז מורשת/dist/education/index.html` and `assets/education-experience.css/js`. The current brief is `scrollcraft/builds/salonika-exhibition/BRIEF.md`; `PRODUCT.md` and the earlier preview note retain v2 context. Fresh independent finish review returned **SHIP**, with no material fixes. Deployment is tracked separately in the repository and GitHub Pages history.

## Requirements and preserved identity

The current brief requests an open Hebrew exhibition page with larger headings, authentic photographs and varied editorial compositions; it rejects heading boxes and uniform framed albums. The incumbent brand, RTL, factual copy, mobile usability, sticky education navigation and original destinations remain binding. Creative decisions and publication are authorized.

This is an extension of the existing identity, not a site-wide replacement. No new global token system, `DESIGN.md`, design sidecar or product rewrite was required. The homepage, its existing library icon, mail routing and other pages are unchanged by this revision.

| Inherited role | Source value |
| --- | --- |
| Navy / ink | `--navy: #1f4f66`; `--ink: #12354a` |
| Teal | `--teal: #0f8a84`; `--teal-2: #0b706b` |
| Copper focus | `--copper: #b0582c` |
| Hebrew display / reading | `postea-hebrew-vf` / `adapter-hebrew-display`, sans-serif |
| Content measure | `--measure: 1280px` |

`site.css` and `typography.css` remain authoritative. Page-local muted text (`#46616b`), fine rules (`#cddeda`) and the pale contact surface (`#eaf2ee`) support that identity.

Source comparison against the checked-out Git `HEAD` confirmed unchanged shared navigation, illustrated masthead and footer, and retention of every factual paragraph in all six chapters. All original section IDs remain: `#schools`, `#soldiers`, `#students`, `#educators`, `#generations`, `#bar-mitzvah`. Both telephone actions retain `tel:+97237788939`; the visible number is `03-7788939`.

Existing photographs from albums 217, 215, 244 and 242 retain their gallery destinations. Provenance remains in `מרכז מורשת/docs/gallery-migration-20261025.json`. The original Salonika masthead, library illustration and VR artwork are reused. No generated historical imagery or invented programme claims were added.

## Layout and type roles

The sequence is the illustrated opening, unboxed introduction, broad schools spread, changing photo/copy compositions, library interlude, photographic onward links and telephone close. Fine rules separate chapters. Photographs use natural height and containment, without ornamental mats or imposed crops.

Desktop schools places its title/introduction above the large photograph and age disclosures. Later chapters reverse selected unequal columns and offset selected photographs. These are education-page compositions, not new site-wide rules.

| Role | Implemented value |
| --- | --- |
| Schools heading | `clamp(3rem, 6vw, 5rem)` |
| Chapter headings | `clamp(2.5rem, 4.6vw, 4rem)`; line-height 1.14; weights 350 / 600 |
| Introduction | `clamp(1.25rem, 1.8vw, 1.5rem)`; line-height 1.65 |
| Chapter body | 18px / 1.8; maximum 54ch |
| Disclosure text / captions | 17px / 14px; captions become 13px on narrow screens |

At 1000px, spacing and navigation density decrease. At 760px and below, the chapter rail becomes a labeled native select and sections stack. Schools reads title/introduction, complete photograph with caption and thumbnails, then age disclosures. Mobile body text remains 18px.

## Interaction, motion and fallback

The chapter dock sticks below the measured shared header. Active links and the native select track the current chapter; links expose `aria-current="location"`. Navigation updates the hash, focuses the heading and accounts for header/dock clearance. Direct hashes align after fonts settle. Keyboard and select navigation are immediate.

Three thumbnail buttons select the schools photograph. Decoding completes before replacement; the image, alt text, linked label, caption and pressed state update together. A request counter prevents stale selections winning, and a polite status announces loading or failure. The complete gallery remains linked. There is no autoplay.

The single authored scroll entrance is a 650ms horizontal opening of the schools photograph, from an 8% inset and opacity 0.8, triggered once by the unchanged Scroll Craft runtime. There is no scroll interception or repeated chapter entrance. Pointer thumbnail changes have a separate 220ms opacity response. Content is visible before enhancement.

Native disclosures retain all school-stage text and work without JavaScript. Thumbnail controls remain hidden until initialization; the initial photograph and gallery link remain available. Keyboard focus is copper, generally a 3px outline with 5px offset; disclosure labels use a visible underline. Programmatic heading focus omits the unwanted heading box. Keyboard mode and reduced-motion CSS remove authored animation/transition duration; reduced motion skips the motion runtime and uses immediate scrolling. These fallback paths were inspected in source; no OS reduced-motion runtime or real-device test is claimed.

## Evidence and scope

The documenter read the current HTML/CSS/JS, shared brand styles, current brief and v2 context; compared preserved markup and paragraphs against `HEAD`; checked all local `src`/`href` paths; and viewed all eight captures in `/workspace/scratch/a7de8a11bb68/results/`:

- `edu3-header-desktop.jpg`, `edu3-schools-desktop.jpg`, `edu3-students-desktop.jpg`
- `edu3-educators-desktop.jpg`, `edu3-related-desktop.jpg`
- `edu3-schools-768.jpg`, `edu3-schools-390.jpg`, `edu3-educators-320.jpg`

The parent/reviewer verified disclosure activation with Enter, thumbnail switching, local destinations and no horizontal overflow at 320px, 390px, 768px and desktop. All eight captures were valid. This is scoped education-page validation, not a site-wide audit.

The independent reviewer adjudicated detector findings as mostly inherited shared identity or parser padding false positives and returned **SHIP**. Existing shared decorative conventions and pre-existing drift were neither canonized as new rules nor repaired outside scope. The fingerprint registry remains unchanged.
