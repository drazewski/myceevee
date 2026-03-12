# MyCeeVee — Free Online CV & Resume Builder

**[myceevee.com](https://myceevee.com)** — Create a professional CV or resume in minutes, directly in your browser. No account required, no data sent to any server. Your CV stays on your device.

---

## What is MyCeeVee?

MyCeeVee is a free, open-source CV and resume builder that runs entirely in the browser. Click any field to edit it, drag sections to reorder them, tweak colors and fonts — then export a pixel-perfect PDF with one click.

Everything you type is saved locally in your browser (localStorage). Nothing is uploaded anywhere.

---

## Features

### Two professional layouts
- **Classic** — two-column European-style CV with a dark sidebar. Great for designers, developers, and anyone in creative or tech fields.
- **US Resume** — clean single-column layout, ATS-friendly. Ideal for job applications in the US and Canada.

### Click-to-edit
Edit your CV directly on the page — click any text to change it. No forms, no sidebars, no separate edit view.

### Full content control
- Personal info: name, job title, location, email, website, GitHub, LinkedIn
- Work experience with role, company, location, period, and bullet points
- Education
- Courses & certifications
- Technologies / skills
- Custom sections — add as many as you need

### Customization
- **Colors** — primary and accent color pickers
- **Typography** — choose from 5 typefaces (System UI, Inter, Lato, Merriweather, Playfair Display)
- **Font sizes** — separate controls for sidebar/header, section titles, body text
- **Spacing** — line height controls per zone
- **Photo** — upload a profile photo, control its size
- **Visibility** — show or hide any element (photo, title, contact items, entire sections)
- **Element order** — drag and drop to reorder sidebar/header items and main sections
- **Contact icons** — show or hide icons next to contact details (US layout)

### Export
- One-click **Export PDF** via the browser's print-to-PDF dialog
- Print layout matches the on-screen preview exactly

### Mobile friendly
- Scales to fit any screen width
- Defaults to the single-column US Resume layout on mobile for easier editing

### Privacy first
- Zero backend — all data lives in your browser's localStorage
- No cookies for tracking (GDPR-compliant cookie consent included)
- No login, no account, no email required

---

## Tech stack

React · TypeScript · Vite · Tailwind CSS · Zustand · Font Awesome

---

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
