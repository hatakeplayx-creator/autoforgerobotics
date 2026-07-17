# AutoForge Visual Audit

Audit date: 2026-07-16

## Scope guardrails

This audit intentionally excludes layout, page structure, navigation placement,
product-card composition, and admin-panel composition. Those elements remain the
functional baseline.

## Visual elements requiring AutoForge differentiation

| Area | Current state | Approved treatment |
| --- | --- | --- |
| Core palette | Generic purple primary with orange accent | Replace through shared AutoForge design tokens using engineered navy, forge orange, and cool metal surfaces |
| Header brand mark | Generic animated cog inside a circular accent badge | Keep the same footprint and placement; refine colors, border, shadow, and motion behavior |
| Storefront backgrounds | Mostly pure white and generic gray surfaces | Introduce subtle cool-metal background and elevated surface tones through tokens |
| Buttons and links | Mixed primary/accent usage with repeated opacity hover styles | Standardize token-backed hover, focus, height, radius, and shadow behavior |
| Borders and shadows | Generic gray borders and stock shadows | Use cool steel borders and restrained AutoForge elevation tokens |
| Status badges | Hardcoded Tailwind blue, green, red, purple, and gray classes in admin screens | Replace with semantic info, success, warning, danger, and neutral tokens |
| Error page | Hardcoded black, white, and gray CSS | Use the same AutoForge semantic palette |
| Hero imagery | Existing AutoForge-labelled banners are wired through CMS/data fallbacks | Preserve until approved replacement files are supplied; keep CMS control and fallbacks |
| Category imagery | Existing category photos are wired through CMS/data fallbacks | Preserve until approved replacement files are supplied; keep responsive aspect ratios and fallbacks |
| Product imagery | Existing catalog images are product data, not decorative layout assets | Preserve; replacements remain manageable through admin media/product tools |
| Wording | No `Robu` wording was found in project-owned storefront/admin source | No copy replacement required |

## Accessibility and UX observations

- Focus styling should be consistent across links, buttons, and form controls.
- Icon-only controls need a minimum mobile touch target without changing their
  placement.
- Reduced-motion users should not receive the animated logo or long hover motion.
- Loading, empty, and error states already preserve page structure; their colors
  should use shared tokens.
- Product titles and images already have overflow and fallback handling; these
  behaviors must remain intact.

## Image replacement status

No approved replacement logo, hero banners, category images, promotional images,
or brand images were included with the request. Existing images therefore remain
in place. Random internet imagery is explicitly out of scope.
