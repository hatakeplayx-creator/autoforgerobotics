# Future Multi-Site Landing Architecture

## Goal

Add a future AutoForge landing experience that connects this ecommerce site and
the second website while keeping both applications independently deployable.

## Recommended routing

- `autoforge.example/` — future brand landing page.
- `shop.autoforge.example/` — this ecommerce storefront and admin application.
- `www.autoforge.example/` or a dedicated product subdomain — the second website.
- During transition, the current storefront route can remain live and redirect
  only after the landing page has been tested.

The landing application should own only brand-level navigation and links. It
should not import storefront routes or admin components.

## Deployment boundaries

Keep three independent deployment units:

1. Landing application.
2. Ecommerce storefront/API.
3. Second website/API.

Each unit should have its own build, environment variables, health checks,
rollback, and release history. Shared packages may be published or consumed from
a small workspace package, but a failed shared-package upgrade must not require
all sites to deploy together.

## Shared branding

Create a versioned brand-token package containing:

- Logo assets and usage rules.
- Color and typography tokens.
- Shared favicon and social-card assets.
- Brand-level header/footer primitives only where their layouts genuinely match.

The ecommerce application should continue to own its storefront and admin
component structures.

## Links between websites

The landing page should use ordinary HTTPS links to both sites. Each site should
provide a visible return link to the main AutoForge domain. Cross-site campaign
links should use documented UTM parameters rather than coupling router state.

## Domain and security setup

- Use managed DNS with separate records per deployment.
- Issue TLS certificates for the apex domain and each subdomain.
- Configure explicit CORS allowlists for API consumers.
- Keep admin cookies or tokens scoped to the ecommerce host unless shared
  authentication is intentionally enabled.
- Maintain separate CSP, rate limits, monitoring, and incident rollback per site.

## Optional shared authentication

Shared authentication is optional. If required later, use an OpenID Connect
identity provider on an auth subdomain. Both websites should be separate clients
with their own redirect URIs, audiences, and logout behavior. Avoid sharing raw
cookies across all subdomains.

Account linking should use stable subject identifiers. Existing ecommerce users
can be migrated gradually, and local authentication should remain available
during a tested transition window.

## Independent operation

The landing page must remain useful when either destination is unavailable.
Destination cards should be static links, not runtime dependencies on both
backends. Each site should keep independent analytics, error reporting, data
stores, and deployment rollback.
