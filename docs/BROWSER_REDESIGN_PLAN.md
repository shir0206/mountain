# Browser Redesign Execution Plan

Integrate `shir.zabolotny.html` content into the existing Browser component architecture.

---

## Section Mapping

| HTML Section | Section ID | Folder | Action |
|---|---|---|---|
| Hero | `overview` | `Sections/Overview/` | Rewrite |
| About | `about` | `Sections/About/` | Rewrite |
| Together (cards + process) | `service` | `Sections/Service/` | Rewrite (keep naming) |
| AI | `ai` | `Sections/AI/` | **Create new** |
| Contact | `contact` | `Sections/Contact/` | Rewrite |
| Footer | — | `Footer/` | **Create new** |

---

## Step 1: Design Tokens & Fonts

**Files:** `src/styles/tokens.css`, `index.html`

Add to `tokens.css`:
```css
/* Caramel palette */
--color-caramel: #9a7b56;
--color-caramel-light: #c9a97d;
--color-sand: #d4c5b0;
--color-ink: #2b2925;
--color-ink-mid: #5a5550;
--color-ink-light: #9a918a;
--color-bg: #f9f6f1;
--color-bg-soft: #f2ede4;
--color-bg-warm: #eae3d8;
--color-line: #ddd7ce;
--color-dark-bg: #1c1a18;
--color-dark-soft: #252320;
--color-dark-line: rgba(255, 255, 255, 0.08);

/* Typography */
--font-display: "Cormorant Garamond", serif;
--font-body: "Jost", sans-serif;

/* Radius */
--radius-s: 6px;
--radius-m: 14px;
--radius-pill: 999px;
```

Add Google Fonts to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
```

---

## Step 2: Update SECTION_IDS

**File:** `src/context/portfolio/types.ts`

Add `AI: "ai"` to `SECTION_IDS`. Keep `SERVICE` as-is.

```ts
export const SECTION_IDS = {
  OVERVIEW: "overview",
  ABOUT: "about",
  SERVICE: "service",
  AI: "ai",
  CONTACT: "contact",
} as const;
```

---

## Step 3: Translations

**Files:** `src/shared/i18n/translations/en.json`, `he.json`

Rewrite with full content from `CONTENT.en` / `CONTENT.he` in the HTML. Structure:

```json
{
  "browser": { ... },
  "navigation": { "overview", "about", "service", "ai", "contact" },
  "hero": { "name", "titleLine", "titleEmphasis", "sub", "actions[]" },
  "about": { "label", "title", "paragraphs[]", "photoHint" },
  "service": {
    "label", "title",
    "cardsLabel", "cards[]",
    "processLabel", "processTitle", "processIntro", "steps[]"
  },
  "ai": {
    "label", "title", "introText", "introSub",
    "pillars[]", "footerText"
  },
  "contact": { "title", "sub", "email", "form": { ... } },
  "footer": { "name", "copy" }
}
```

---

## Step 4: Update i18n Types

**File:** `src/shared/i18n/types.ts`

Update `TranslationSchema` interface to match the new JSON structure.

---

## Step 5: Icons

### New SVG icons to create:

**`src/assets/icons/process/`** (from HTML `ICONS` object):
- `search.svg`
- `lightbulb.svg`
- `code.svg`
- `sparkles.svg`
- `loop.svg`

**`src/assets/icons/ai/`**:
- `link.svg`
- `zap.svg`
- `target.svg`

### Delete unused:
- `src/assets/icons/service/checklist.svg`
- `src/assets/icons/service/dialog.svg`
- `src/assets/icons/service/monitors.svg`
- `src/assets/icons/service/structure.svg`
- `src/assets/icons/service/test.svg`

Keep `src/assets/icons/service/code.svg` (still relevant).

---

## Step 6: Overview (Hero) Section

**Files:** `src/presentation/Browser/Sections/Overview/Overview.tsx`, `Overview.css`

**Component structure:**
```tsx
<section className="hero">
  <div className="hero-inner">
    <p className="hero-name">{t.hero.name}</p>
    <h1 className="hero-title">
      {t.hero.titleLine}<br/><em>{t.hero.titleEmphasis}</em>
    </h1>
    <p className="hero-sub">{t.hero.sub}</p>
    <div className="hero-actions">
      {t.hero.actions.map(action => <Button ... />)}
    </div>
  </div>
</section>
```

**CSS:** fadeUp animations, decorative circle `::before`, responsive padding, clamp() font sizes.

Delete: `src/assets/images/branch.svg`, `src/assets/images/circle.svg`

---

## Step 7: About Section

**Files:** `src/presentation/Browser/Sections/About/About.tsx`, `About.css`

**Component structure:**
```tsx
<div className="about-grid">
  <div className="about-photo-wrap">
    <img src={imagePath} alt="Shir Zabolotny" />
  </div>
  <div className="about-body">
    <p className="section-label">{t.about.label}</p>
    <h2 className="section-title" dangerouslySetInnerHTML={...} />
    {t.about.paragraphs.map(p => <p dangerouslySetInnerHTML={...} />)}
  </div>
</div>
```

**CSS:** Flex column → row at 768px, photo 260–320px, `bg-soft` background.

---

## Step 8: Service Section (Together Content)

**Files:** `src/presentation/Browser/Sections/Service/Service.tsx`, `Service.css`

**Component structure:**
```tsx
<>
  <p className="section-label">{t.service.label}</p>
  <h2 className="section-title" ... />

  {/* Cards Grid */}
  <p className="section-label">{t.service.cardsLabel}</p>
  <div className="cards-grid">
    {t.service.cards.map(card => <ServiceCard ... />)}
  </div>

  {/* Process Timeline */}
  <p className="section-label">{t.service.processLabel}</p>
  <h3>{t.service.processTitle}</h3>
  <p className="process-intro">{t.service.processIntro}</p>
  <div className="process-list">
    {t.service.steps.map(step => <ProcessItem ... />)}
  </div>
</>
```

**CSS:** 
- Cards: 1col → 2col@560px → 4col@1024px
- Process: vertical with dot/line on mobile, horizontal timeline at ≥900px

---

## Step 9: AI Section (New)

**Files:** `src/presentation/Browser/Sections/AI/AI.tsx`, `AI.css`

**Component structure:**
```tsx
<section className="ai-section">
  <p className="section-label">{t.ai.label}</p>
  <h2 className="section-title" ... />
  
  <div className="ai-intro">
    <p className="ai-intro-text">{t.ai.introText}</p>
    <p className="ai-intro-sub">{t.ai.introSub}</p>
  </div>

  <div className="ai-pillars">
    {t.ai.pillars.map(pillar => <AIPillar ... />)}
  </div>

  <div className="ai-footer">
    <p className="ai-footer-text" dangerouslySetInnerHTML={...} />
  </div>
</section>
```

**CSS:** Dark background (`--color-dark-bg`), pillar cards with dark-soft bg, 1→2→3 col grid, caramel accents.

---

## Step 10: Contact Section

**Files:** `src/presentation/Browser/Sections/Contact/Contact.tsx`, `Contact.css`

**Component structure:**
```tsx
<div className="contact-grid">
  <div className="contact-left">
    <h2 className="contact-title" ... />
    <p className="contact-sub">{t.contact.sub}</p>
    <a className="contact-email-link" href={`mailto:${t.contact.email}`}>
      <MailIcon /> {t.contact.email}
    </a>
  </div>
  <form className="contact-form" onSubmit={handleSubmit}>
    <div className="form-row">
      <FormGroup label={t.contact.form.nameLabel} ... />
      <FormGroup label={t.contact.form.emailLabel} ... />
    </div>
    <FormGroup label={t.contact.form.messageLabel} textarea ... />
    <button type="submit">{t.contact.form.submit}</button>
  </form>
</div>
```

**CSS:** Column → row at 900px, form inputs with border-radius-s, focus state caramel.

**Delete:** `Contact/services/generateCalendarLink.ts`, `meetingScheduler.ts`, `phoneValidator.ts`, `Contact/contactConfig.ts`, `Contact/types.ts`
Keep: `generateEmailLink.ts`, `generateWhatsAppLink.ts` (if needed), `useContactLinks.ts`

---

## Step 11: Footer Component

**Files:** `src/presentation/Browser/Footer/Footer.tsx`, `Footer.css`

```tsx
<footer className="browser-footer">
  <div className="footer-name" dangerouslySetInnerHTML={...} />
  <p className="footer-copy">{t.footer.copy.replace("{year}", year)}</p>
</footer>
```

Rendered in `BrowserShell.tsx` after the sections map.

---

## Step 12: Navigation Updates

**File:** `src/presentation/Browser/Navigation/Navigation.tsx`

Update `navigationItems` array to include AI:
```ts
{ id: SECTION_IDS.OVERVIEW, label: t.navigation.overview },
{ id: SECTION_IDS.ABOUT, label: t.navigation.about },
{ id: SECTION_IDS.SERVICE, label: t.navigation.service },
{ id: SECTION_IDS.AI, label: t.navigation.ai },
{ id: SECTION_IDS.CONTACT, label: t.navigation.contact },
```

Update `Navigation.css` — caramel underline hover effect matching HTML nav styling.

---

## Step 13: Scroll Reveal Hook

**File:** `src/presentation/Browser/hooks/useScrollReveal.ts`

IntersectionObserver hook that adds `.visible` class to `.reveal` elements within `contentRef`:

```ts
export function useScrollReveal(
  containerRef: RefObject<HTMLDivElement | null>,
  ready: boolean
) {
  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1, root: containerRef.current }
    );
    containerRef.current.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ready]);
}
```

Add global `.reveal` / `.visible` CSS to `Browser.css`.

---

## Step 14: Update browserConfig + BrowserShell

**`browserConfig.ts`** — add AI section:
```ts
import AI from "./Sections/AI/AI";

export const SECTIONS = [
  { id: SECTION_IDS.OVERVIEW, Screen: Overview },
  { id: SECTION_IDS.ABOUT, Screen: About },
  { id: SECTION_IDS.SERVICE, Screen: Service },
  { id: SECTION_IDS.AI, Screen: AI },
  { id: SECTION_IDS.CONTACT, Screen: Contact },
] as const;
```

**`BrowserShell.tsx`** — import + render `<Footer />` after sections loop.

---

## Step 15: Cleanup

Delete:
- `src/assets/icons/service/checklist.svg`
- `src/assets/icons/service/dialog.svg`
- `src/assets/icons/service/monitors.svg`
- `src/assets/icons/service/structure.svg`
- `src/assets/icons/service/test.svg`
- `src/assets/images/branch.svg`
- `src/assets/images/circle.svg`
- `src/presentation/Browser/Sections/Contact/contactConfig.ts`
- `src/presentation/Browser/Sections/Contact/types.ts`
- `src/presentation/Browser/Sections/Contact/services/generateCalendarLink.ts`
- `src/presentation/Browser/Sections/Contact/services/meetingScheduler.ts`
- `src/presentation/Browser/Sections/Contact/services/phoneValidator.ts`

---

## Execution Order

1. Tokens + Fonts
2. SECTION_IDS
3. Translations + Types
4. Icons (create new, delete old)
5. Overview (Hero)
6. About
7. Service (Together content)
8. AI (new)
9. Contact
10. Footer
11. Navigation
12. Scroll Reveal hook
13. browserConfig + BrowserShell
14. Cleanup
15. Test with `yarn dev`
