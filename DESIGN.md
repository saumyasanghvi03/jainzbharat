# DESIGN.md — JainZBharat Design System (Base44)

Derived from the Base44 production app at jainz-wisdom-global.base44.app.

---

## 1. Design Tokens

### Colors (HSL — Dark Mode)

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--background` | `220 20% 4%` | `#080b12` | Page background |
| `--foreground` | `0 0% 95%` | `#f2f2f2` | Primary text |
| `--card` | `220 18% 7%` | `#0e121a` | Card surface |
| `--card-foreground` | `0 0% 95%` | `#f2f2f2` | Card text |
| `--primary` | `24 95% 53%` | `#f97316` | Orange — buttons, links, highlights |
| `--primary-foreground` | `0 0% 100%` | `#ffffff` | Text on primary |
| `--secondary` | `160 84% 39%` | `#10b981` | Emerald — secondary actions |
| `--secondary-foreground` | `0 0% 100%` | `#ffffff` | Text on secondary |
| `--accent` | `43 96% 56%` | `#f59e0b` | Amber — callouts, badges |
| `--accent-foreground` | `0 0% 6%` | `#0f0f0f` | Text on accent |
| `--muted` | `220 14% 12%` | `#1a1f2e` | Muted surface |
| `--muted-foreground` | `0 0% 55%` | `#8c8c8c` | Muted text |
| `--border` | `220 14% 14%` | `#1e2433` | Borders |
| `--ring` | `24 95% 53%` | `#f97316` | Focus ring (orange) |
| `--destructive` | `0 62% 30%` | `#7f1d1d` | Error / delete |

### Typography

| Token | Value |
|-------|-------|
| `--font-heading` | `"Space Grotesk", ui-sans-serif, system-ui, sans-serif` |
| `--font-body` | `"Inter", ui-sans-serif, system-ui, sans-serif` |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` |

### Border Radius

| Token | Value |
|-------|-------|
| `--radius` | `0.75rem` |
| Card radius | `1rem` (`rounded-2xl`) |
| Buttons / pills | `9999px` (`rounded-full`) |

### Shadows

| Level | Value |
|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / .05)` |
| `shadow` | `0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1)` |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1)` |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1)` |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1)` |

### Glass Card
```css
.glass-card {
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(40px);
}
```

---

## 2. Component Standards

All components use `cn()` utility from `tailwind-merge` + `clsx`.

### Button
- **Default**: `bg-primary text-primary-foreground hover:bg-primary/90 rounded-full`
- **Secondary**: `bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full`
- **Ghost**: `hover:bg-accent hover:text-accent-foreground rounded-full`
- **Outline**: `border border-border bg-transparent hover:bg-accent hover:text-accent-foreground rounded-full`
- **Danger**: `bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full`

### Card
- Glass card with `rounded-2xl`, `border border-white/5`, `bg-white/[.03]`, `backdrop-blur-[40px]`
- Hover: `hover:border-orange-500/30`
- Transition: `duration-300 ease-out`

### Badge
- Orange: `bg-orange-500/10 text-orange-500 border border-orange-500/20`
- Emerald: `bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`
- Amber: `bg-amber-500/10 text-amber-500 border border-amber-500/20`

### Input
- `bg-transparent border border-input rounded-xl px-4 py-3 text-foreground`
- Focus: `ring-2 ring-ring ring-offset-2 ring-offset-background`

---

## 3. Page Layout

- Max width: `max-w-7xl` (1280px)
- Horizontal padding: `px-4 md:px-6`
- Vertical section padding: `py-16 md:py-20`
- Gradient background: `bg-gradient-to-b from-background via-background to-background/80`
- Grid: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`

---

## 4. Animation

- Hover transitions: `duration-300 ease-out`
- Page transitions: subtle fade-up via Framer Motion (opacity 0→1, y 10→0)
- Focus: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

---

## 5. Accessibility

- Min contrast 4.5:1 for body text
- Focus visible on all interactive elements
- `sr-only` for screen-reader text
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
